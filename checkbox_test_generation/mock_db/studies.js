var votes = require('./votes.js');
var db = require('./db.js');
var mock_studies = require('../test_data/studies.json');
var fs = require('fs');
//require('../mock_routes/admin.js');

var studies = require('./studies.js');

studies.findOne = function(dict, cb){
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
		console.log( " key = " +  mock_studies[m_i][key]);
		console.log( " val =  " + value);
		if(mock_studies[m_i][key] == value){
			cb(null, mock_studies[m_i]);
		};
	};
};

studies.find = function(dict){
	console.log("enterssss bro");
	var result = [];
	if(dict == null){
		for(var m_i = 0; m_i < mock_studies.length; m_i++){
			result.push(mock_studies[m_i]);		
		}
		if(m_i == (mock_studies.length -1)){
			return {
				toArray:  function(cb){
					cb(null, result);
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
			}
			if(m_i == (mock_studies.length -1)){
				return {
					toArray:  function(cb){
						cb(null, result);
					}
				}
			}
		}

	}
	console.log(dict == null);
}




studies.update = function(identifier, value){
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
			fs.writeFile("../test_data/studies.json", mock_studies, function(err){
				if(err){
					return console.log(err);
				}
				console.log("the file was saved!");
			});
		}
	}
};



module.exports = studies;


