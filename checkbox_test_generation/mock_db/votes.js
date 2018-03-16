var studies = require('studes.js');
var db = require('db.js');
var mock_votes = require('');

var votes;



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
