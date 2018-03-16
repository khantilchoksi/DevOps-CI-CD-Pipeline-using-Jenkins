var fs = require('fs');

function formatJsonAsCSV( items )
{
   var csv = "";
   var questions = "";

   var questionLength = sizeOfRow( items );

	//console.log( questionLength );

	for( var i=0; i < items.votes.length; i++ )
   {
		var vote = items.votes[i];

		var row = [];
		var questionPos = {};
		var len = 0;
		for( var q in questionLength )
		{
			// set question offset
			questionPos[q] = len;
			len += questionLength[q];

			// initialize row array
			for( var r=0; r< questionLength[q]; r++ )
			{
				row.push("");				
			}
		}

		for( var a=0; a < vote.answers.length; a++ )
		{
			var ans = vote.answers[a];
			if( ans.kind == "singlechoice" )
			{
				var pos = questionPos[ans.question];
				row[pos] = ans.answer;
			}
			if( ans.kind == "singlechoicetable" )
			{
				for( var prop in ans.answer )
				{
					var colNum = parseInt(prop.split("_")[1]);
					var pos = questionPos[ans.question] + colNum;
					row[pos] = ans.answer[prop];
				}
			}
			if( ans.kind == "textarea" || ans.kind == "text")
			{
				var pos = questionPos[ans.question];
				row[pos] = ans.answer;
			}
		}

		var rowOut = "";
		for( var r = 0; r < row.length; r++ )
		{
			var col = row[r];
			col = col.replace( new RegExp('"','g'), '""' );
			col = col.replace( new RegExp('\n','g'), '\r' );

			rowOut += '"' + col + '"';
			if( r < row.length - 1 )
			{
				rowOut += ",";
			}
		}

		csv += rowOut + "\n";
	}

	return csv;
}

// WORK AROUND
function sizeOfRow( items )
{
	var questionMaxLength = {};
	var questionLength = {};

	//console.log(items.votes.length);

	for( var i=0; i < items.votes.length; i++ )
   {
		var vote = items.votes[i];

		var rowLength = 0;

		for( var a=0; a < vote.answers.length; a++ )
		{
			var ans = vote.answers[a];

			if( ans.kind == "singlechoice" )
			{
				questionLength[ans.question] = 1;
			}
			if( ans.kind == "singlechoicetable" )
			{
				var obj = ans.answer;
				var len = 0;
				for( var prop in obj )
				{
					len++;
				}
				questionLength[ans.question] = len;
			}
			if( ans.kind == "textarea" || ans.kind == "text")
			{
				questionLength[ans.question] = 1;
			}
		}

		for( var q in questionLength )
		{
			if( !questionMaxLength[q] )
				questionMaxLength[q] = 0;

			if( questionLength[q] > questionMaxLength[q] )
				questionMaxLength[q] = questionLength[q];			
		}
   }
   return questionMaxLength;
}
