var votes = require('./votes.js');
var db = require('./db.js');
var fs = require('fs');
//require('../mock_routes/admin.js');

var studies = require('./studies.js');
var mock_studies = JSON.parse(require('fs').readFileSync('./test_data/studies.json', 'utf8'));

var temp_token = null;
var temp_invite = null;
var study_number = null;


studies.findOne = function(dict, cb){
	try{
		if(study_number != null){
			mock_studies[study_number]['token'] =  temp_token;
			mock_studies[study_number]['invitecode'] = temp_invite;
		}

		console.log("dict");
		console.log(dict);
		var key = Object.keys(dict)[0];
		console.log(key);
		if(typeof dict[key] === 'object' && dict[key] !== null){
			var value = dict[key].val;
		}
		else{
			var value = dict[key];
		}
		//	console.log(value);
		//	console.log('key = ' + key + '; value = ' + value);
		for(var m_i in mock_studies){
			console.log('m_i = ' + m_i);
			console.log('keyvalue = ' + key);
			console.log(mock_studies[m_i]);
			console.log( " key = " +  mock_studies[m_i][key]);
			console.log( " val =  " + value);
			if(mock_studies[m_i][key] == value){
				temp_token = mock_studies[m_i]['token'];
				temp_invite = mock_studies[m_i]['invitecode'];
				study_number = m_i;
				cb(null, mock_studies[m_i]);
			};
		};
			}
			catch(e){
				console.log(e);
			}
};

studies.find = function(dict){
	var mock_studies = require('../test_data/studies.json');
	console.log("enterssss bro");
	var result = [];
	if(dict == null){
		console.log('dict is null');
		for(var m_i = 0; m_i < mock_studies.length; m_i++){
			result.push(mock_studies[m_i]);		
			if(m_i == (mock_studies.length -1)){
				console.log('final iteration');
				console.log(result);
				return {
					toArray:  function(cb){
						console.log('inside to array 39');
						cb(null, result);
					}
				}
			}
		}
	}
	else{
		var input_keys = Object.keys(dict);
		var values = [];
		for(var i=0; i < input_keys.length; i++){
			if(typeof dict[input_keys[i]] === 'object' && dict[input_keys[i]] !== null){		
				values.push(dict[input_keys[i]].val);
			}
			else{
				values.push(dict[input_keys[i]]);			
			}
		}

		for(var m_i = 0; m_i < mock_studies.length; m_i++){
			var study = mock_studies[m_i];
			for(var i=0; i < input_keys.length; i++){
				if(mock_studies[m_i][input_keys[i]] == values[i]){
					if( i == ((input_keys.length)-1)){
						result.push(mock_studies[m_i]);		
					}
				}
				if(m_i == (mock_studies.length -1)){
					return {
						toArray:  function(cb){
							console.log('inside to array');
							console.log(result);
							cb(null, result);
						}
					}
				}
			}
		}

	}
	console.log(dict == null);
}


studies.aggregate = function(dict, cb){
	var mock_studies = require('../test_data/studies.json');
	console.log("entering aggregate");
	var result = [];
	for(var m_i = 0; m_i < mock_studies.length; m_i++){
		result.push(mock_studies[m_i]);		
	}
	cb(null, result);
}


studies.update = function(identifier, value, cb){
	var mock_studies = require('../test_data/studies.json');
	var identifier_key = Object.keys(identifier)[0];
	//	console.log(key);
	if(typeof identifier[identifier_key] === 'object' && identifier[identifier_key] !== null){
		var identifier_value = identifier[identifier_key].val;
	}
	else{
		var identifier_value = identifier[identifier_key];
	}

	var set_or_unset = Object.keys(value)[0];
	if(set_or_unset.toString() == '$set'){
		var key_to_be_set = Object.keys(value[set_or_unset])[0];
		var val_to_be_set = value[set_or_unset][key_to_be_set];
	}

	for(var m_i in mock_studies){
		if(mock_studies[m_i][identifier_key] == identifier_value){
			mock_studies[m_i][key_to_be_set] = val_to_be_set;
		}
		if(m_i == (mock_studies.length)-1){
			fs.writeFile("../checkbox_test_generation/test_data/studies.json", JSON.stringify(mock_studies), function(err){
				if(err){
					return console.log(err);
				}
				console.log("the entry was updated!");
				if(cb)
					cb(null, 'success');
			});
		}
	}
};

studies.insert = function(study, safe_dict, cb){
	var mock_studies = require('../test_data/studies.json');
	study._id = mock_studies.length+1;
	var new_entry = {};
	var keys = Object.keys(mock_studies[0]);
	console.log(mock_studies.length+1);
	console.log("---------137--------------");
	//console.log(keys);
	for(var m_i in keys){
		let a = keys[m_i];
		if(study[a] == undefined)
			new_entry[keys[m_i]] = `'test${mock_studies.length+1}'`;
		else
			new_entry[keys[m_i]] = study[a];

		console.log(keys[m_i]);
		console.log(new_entry);
	}
	console.log('inside insert');
	console.log(study.name);
	console.log(study.description);
	mock_studies.push(new_entry);
	console.log('after push');
	console.log(mock_studies[mock_studies.length-1]);
	fs.writeFile("../checkbox_test_generation/test_data/studies.json", JSON.stringify(mock_studies), function(err){
		if(err){
			return console.log(err);
		}
		console.log("the entry was inserted");
		cb(null, 'success');
	})

};


module.exports = studies;


