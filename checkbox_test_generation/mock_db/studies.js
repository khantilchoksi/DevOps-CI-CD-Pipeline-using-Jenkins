var votes = require('./votes.js');
var db = require('./db.js');
var mock_studies = require('../test_data/studies.json');

var studies = require('./studies.js');

studies.findOne = function(dict, cb){
	var key = Object.keys(dict)[0];
//	console.log(key);
	var value = dict[key].val;
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



module.exports = studies;


