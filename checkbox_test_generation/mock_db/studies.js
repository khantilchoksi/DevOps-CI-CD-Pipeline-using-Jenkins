var votes = require('votes.js');
var db = require('db.js');
var mock_studies = require('');

var studies;

studies.findOne = function(dict, cb){
	var key = Object.keys(dict)[0];
	var value = dict[key];
	for(var m_i in mock_studies){
		if(m_i[key] == value){
			cb(null, m_i);
		};
	};

};



module.exports = studies;


