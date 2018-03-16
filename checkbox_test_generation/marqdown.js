var marked = require('marked');
var fs = require('fs');
var JSON5 = require('json5');
var jade = require('jade');
var _ = require('underscore');

var templates = loadJadeTemplates();

exports.render = function(data)
{
	console.log(data);
	marked.setOptions({gfm:true,tables:true});

  	var lines = data.split("\n");
  	var header = ReadHeader(lines);
	console.log(header);
  	var qOptions = JSON5.parse(header);

  	var body = ReadBody(lines);

	var tokens = marked.lexer(body, {gfm:true,tables:true});

	//console.log(tokens);
	var newTokens = ProcessTokens(tokens, qOptions);

	var text = marked.parser(newTokens);

	return text;
};


function loadJadeTemplates()
{
	var options = {pretty:true};

	var singlechoice = jade.compile(fs.readFileSync('jade/singlechoice.jade', 'utf8'),options);
	var multichoice = jade.compile(fs.readFileSync('jade/multichoice.jade', 'utf8'),options);
	var singlechoicetable = jade.compile(fs.readFileSync('jade/singlechoicetable.jade', 'utf8'),options);
	var multichoicetable = jade.compile(fs.readFileSync('jade/multichoicetable.jade', 'utf8'),options);
	var text = jade.compile(fs.readFileSync('jade/text.jade', 'utf8'),options);
	var textarea = jade.compile(fs.readFileSync('jade/textarea.jade', 'utf8'),options);
	var code = jade.compile(fs.readFileSync('jade/code.jade', 'utf8'),options);

	var fileupload = jade.compile(fs.readFileSync('jade/upload.jade', 'utf8'),options);

	return {
		singlechoice: singlechoice,
		multichoice: multichoice,
		singlechoicetable: singlechoicetable,
		multichoicetable: multichoicetable,
		text:text,
		textarea:textarea,
		code:code,
		fileupload:fileupload
	};
}


function testFile()
{
	fs.readFile('test.md', 'utf8', function (err,data) {
	  	if (err) {
	    	return console.log(err);
	  	}

		marked.setOptions({gfm:true,tables:true});

	  	var lines = data.split("\n");
	  	var header = ReadHeader(lines);
	  	var qOptions = JSON5.parse(header);

	  	var body = ReadBody(lines);

		var tokens = marked.lexer(body, {gfm:true,tables:true});

		//console.log( new marked.Lexer().rules );
		//console.log(tokens);
		var newTokens = ProcessTokens(tokens, qOptions);

		var tree = marked.parser(newTokens);

		console.log(tree);
	});
}

function ReadHeader(lines)
{
	var header = "";
	for( var i =0; i < lines.length; i++ )
	{
		var line = lines[i];
		if( line.indexOf("---") == 0 )
		{
			return header;
		}
		header += line;
	}
}

function ReadBody(lines)
{
	var body = "";
	var start = false;
	for( var i =0; i < lines.length; i++ )
	{
		var line = lines[i];
		if( !start && line.indexOf("---") == 0 )
		{
			start = true;
			continue;
		}
		if( start )
		{
			body += line + "\n";
		}
	}
	return body;
}

function EscapeCode(text)
{
	return text
	.replace(/\\/g,'\\\\')
	.replace(/`/g, '\\`')
	.replace(/[*]/g, '\\*')
	.replace(/_/g, '\\_')	
	.replace(/[{][}]/g, '\\{}')
	.replace(/\[\]/g, '\\[]')
	.replace(/[(][)]/g, '\\()');
//	.replace('#', '\\()')
//+   plus sign
//-   minus sign (hyphen)
//.   dot
//!   exclamation mark
}

function ProcessTokens(tokens, qOptions)
{
	var newTokens = [];

	var listKind = null;
	var list = null;

	var questionNumber = 0;

	// parentToken is a placeholder that gets inserted into token stream when processing a question header, 
	// but prior to knowing what type of question it will be.
	// Later on, when the body of the question is determined (multiple choice, etc).  A reference to this token 
	// is updated to insert meta data about question.
	var parentToken = null;
	var parentHeader = '<div data-question="{0}" data-kind="{1}">';
	// hr in markdown (------) marks a new page in marqdown.
	// Questions are wrapped in a container div, with a data attribute indicating what page it belongs on.
	var pageNumber = 0;
	var pageHeader = '<div data-page="{0}">';

	// First page.
	newTokens.push({ type: 'text', text: pageHeader.format(pageNumber++)});

	for( var i = 0; i < tokens.length; i++ )
	{
		var t = tokens[i];
		newTokens.push(t);

		if( t.type == "code" && t.lang && t.lang == "none" )
		{
			//console.log(t);
			// remove code
			newTokens.splice(newTokens.length-1, 1);

			var html = templates.code( {text: EscapeCode(t.text)} );
			//console.log( html );

			newTokens.push({ type: 'text', text: html});
		}

		if( t.type == "heading" && t.depth == 3)
		{
			if( questionNumber > 0)
			{
				var lastToken = newTokens[newTokens.length-2]; 
				// Check if last token is a data-page marker.  If so, then need to end question div 1 before it.
				if( lastToken.type == "text" && lastToken.text.indexOf("data-page=") >= 0 )
				{
					newTokens.splice(newTokens.length-3, 0, {type:'text',text: '</div>'});
				}
				else
				{
					newTokens.splice(newTokens.length-1, 0, {type:'text',text: '</div>'});
				}
			}
			parentToken = {type:'text',text: ''};
			newTokens.splice(newTokens.length-1, 0, parentToken);
			//newTokens.push(parentToken);

			questionNumber++;
			if( qOptions.NumberQuestions )
			{
				t.text = questionNumber + ". " + t.text;
			}
		}

		if( t.type == "hr")
		{
			// remove hr token
			newTokens.splice(newTokens.length-1, 1);

		
			newTokens.push({type:'text',text: '</div>'} );
			//newTokens.push({ type: 'text', text: '<span></span></div>'});
			newTokens.push({type:'text',text: pageHeader.format(pageNumber++)} );			

		}


		// TODO: Other textbox "choice"
		if( t.type == "list_start")
		{
			// remove list_start
			newTokens.splice(newTokens.length-1, 1);

			var choices = [];
			var innerTokens = [];
			var listKind = t.ordered;
			var itemNumber = 0;
			while( t && t.type != "list_end" )
			{
				if( t.type == "list_item_start" || t.type == "loose_item_start" )
				{
					innerTokens = [];
				}

				if( t.type != "list_item_start" && t.type != "loose_item_start" && t.type != "list_item_end")
				{
					innerTokens.push( t );
					itemNumber++;
				}

				if( t.type == "list_item_end" )
				{
					innerTokens.links = tokens.links
					
					var embeddedHtml = processInnerText(innerTokens, tokens);

					var choice = {label: embeddedHtml, name: questionNumber, value: choices.length };
					choices.push( choice );
				}

				t = tokens[++i];
			}

			var html = "";
			if( listKind )
			{
				html = templates.singlechoice( {choices: choices} );
				parentToken.text = parentHeader.format(questionNumber, 'singlechoice');
			}
			else
			{
				html = templates.multichoice( {choices: choices} );
				parentToken.text = parentHeader.format(questionNumber, 'multichoice');
			}

			newTokens.push({ type: 'text', text: html});
		}

		if( t.type == "blockquote_start" )
		{
			// next token.
			t = tokens[++i];

			if( t.text && t.text.indexOf("{") > -1 )
			{
				// remove blockquote_start
				newTokens.splice(newTokens.length-1, 1);

				var text = t.text;

				// eat up remaining.
				while( t.type != "blockquote_end" )
				{
					t = tokens[++i];
				}

				// parse json representation
				var json = JSON5.parse(text);

				var html = "";
				if( json && json.upload )
				{
					html = templates.fileupload( {placeholder: json.placeholder, name: questionNumber} );
					parentToken.text = parentHeader.format(questionNumber, 'fileupload');					
				}
				else if( json && json.rows && json.rows > 1 )
				{
					html = templates.textarea( {placeholder: json.placeholder, rows: json.rows, name: questionNumber} );
					parentToken.text = parentHeader.format(questionNumber, 'textarea');
				}
				else
				{
					var placeholder = "";
					if( json && json.placeholder )
						placeholder = json.placeholder;
					html = templates.text( {name: questionNumber, placeholder: placeholder} );
					parentToken.text = parentHeader.format(questionNumber, 'text');
				}

				newTokens.push({ type: 'text', text: html});
			}
			else
			{
				// keep regular top-level blockquote.
				newTokens.push( t );
			}

		}
		
		if( t.type == "table" )
		{
			// TODO: alignment
			if( t.cells.length == 0 || t.cells[0].length != t.header.length )
				continue; // let marked handle it...

			// remove table
			newTokens.splice(newTokens.length-1, 1);

			// Handle marked bug:
			var lastRow = t.cells.length-1;
			if( lastRow > 0 && t.cells[lastRow].length != t.cells[lastRow - 1].length )
			{
				// marked bug misses last cell if empty
				t.cells[lastRow].push("");
			}

			var headers = t.header;
			var bodyRows = t.cells;

			var html = "";
			// Is this a multi-choice?
			// choice | [] | [ ] | [ ] |
			var testChoices = bodyRows[0].slice(1,bodyRows[0].length);
			if( _.any( testChoices, function(col)
					{
						// without whitespace is []
						return col.trim().replace(/\s/g, "") == "[]";
					}
				 )
			)
			{
				html = templates.multichoicetable( {table:questionNumber, headers: headers, rows: bodyRows} );
				parentToken.text = parentHeader.format(questionNumber, 'multichoicetable');
			}
			else
			{
				html = templates.singlechoicetable( {table:questionNumber, headers: headers, rows: bodyRows} );
				parentToken.text = parentHeader.format(questionNumber, 'singlechoicetable');
			}

			newTokens.push({ type: 'text', text: html});
		}
	}

	// Close page div. 
	newTokens.push({ type: 'text', text: '</div>'});


	newTokens.links = tokens.links;
	return newTokens;
}

function processInnerText(innerTokens, tokens)
{
	var embeddedHtml = "";
	if( _.all( innerTokens, function(tok) { return tok.type == "text" || tok.type == "space";} ) )
	{
		// If simple text, use inline lexer which doesn't insert a misc. <p> by default.
		for( x=0; x < innerTokens.length; x++ )
		{
			var tok = innerTokens[x];
			if( tok.text )
				embeddedHtml += marked.inlineLexer(tok.text, tokens.links);
		}
	}
	else
	{
		// more complex or block based content.
		//console.log(innerTokens);
		var filtered = innerTokens.filter(function(tok){return tok.type == "space" || tok.type == "text";});
		filtered.links = innerTokens.links;
		embeddedHtml = marked.parser( filtered ).trim();
	}
	return embeddedHtml;
}

//first, checks if it isn't implemented yet
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

