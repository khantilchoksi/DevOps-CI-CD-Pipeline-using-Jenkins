var studies = require('./studies.js');
var db = require('./db.js');
var mock_votes = require('../test_data/votes.json');

var votes = require('./votes.js');



votes.findOne = function(dict, cb){
	var key = Object.keys(dict)[0];
	var value = dict[key];
	for(var m_i in mock_votes){
		if(m_i[key] == value){
			cb(null, m_i);
		};
	};

};


module.exports = votes;
