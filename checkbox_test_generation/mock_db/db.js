var studies = require('./studies.js');
var votes = require('./votes.js');
var db = require('./db.js');


db.collection = function(collect, cb){
	try{
		if(collect.toString().trim() === 'studies'){
			cb(null, studies);

		}
		else if(collect.toString().trim() === 'votes'){
			cb(null, votes);
		}		
	}
	catch(e){
			cb(e, '');
	}
};

/*exports.findOne = function(){};
var func_collection = function(){};


exports.loadStudy = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving study: ' + id);
    db.collection('studies', function(err, collection) {
        collection.findOne({'_id':new ObjectID(id)}, function(err, item) {
            // don't allow token to be seen by others.
            delete item["token"];
            delete item["invitecode"];

            res.send(item);
        });
    });
};
*/
module.exports = db;