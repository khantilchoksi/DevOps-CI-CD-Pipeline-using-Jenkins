var studies = require('./studies.js');
var db = require('./db.js');
var mock_votes = require('../test_data/votes.json');

var votes = require('./votes.js');


votes.findOne = function(dict, cb){
	var key = Object.keys(dict)[0];
//	console.log(key);
	var value = dict[key].val;
//	console.log(value);
//	console.log('key = ' + key + '; value = ' + value);
	for(var m_i in mock_votes){
		console.log( " key = " +  mock_votes[m_i][key]);
		console.log( " val =  " + value);
		if(mock_votes[m_i][key] == value){
			cb(null, mock_votes[m_i]);
		};
	};
};


module.exports = votes;
