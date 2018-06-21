var studies = require('./studies.js');
var votes = require('./votes.js');
var surveys = require('./surveys.js');
var db = require('./db.js');


db.collection = function(collect, cb){
	try{
		console.log("inside db: _ + " + collect.toString().trim());
		if(collect.toString().trim() === 'studies'){
			console.log("enters studies");
			cb(null, studies);

		}
		else if(collect.toString().trim() === 'votes'){
			console.log("enters votes");
			cb(null, votes);
		}		
		else if(collect.toString().trim() === 'surveys'){
			console.log("enters surveys");
			cb(null, surveys);
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