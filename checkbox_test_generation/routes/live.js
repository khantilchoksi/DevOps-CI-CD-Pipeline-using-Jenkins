var mongo = require('mongodb');
var check = require('validator').check;
var _ = require('underscore');

var Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.BSONPure.ObjectID;
 
var MongoClient = mongo.MongoClient;
var db = null;
MongoClient.connect("mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@"+process.env.MONGO_IP+":27017/site?authSource=admin", function(err, authdb) {
  // Now you can use the database in the db variable
  db = authdb;
  console.log( err || "connected!" );
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving votes: ' + id);
    db.collection('votes', function(err, collection) {
        collection.findOne({'_id':new ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAllByIP = function(req, res) {
    var name = req.params.id;
    console.log('Retrieving votes owned by: ' + name);
    db.collection('votes', function(err, collection) {
        collection.find({'OWNER': name}).toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('votes', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.getSurveyStats = function(req, res) {
    var surveyId = new ObjectID(req.params.id);

    db.collection('votes', function(err, collection) {
        //collection.find({'survey.$id':surveyId}).toArray(function(err, items) {
        collection.find({'surveyId':surveyId}).toArray(function(err, items) {            
            res.send({votes: items.length});
        });
    });
};


exports.download = function(req, res ) {
    var token = req.params.token;
    console.log(token);

        // get surveyId, then votes matching that.
    db.collection('surveys', function(err, surveyCollection) {
        surveyCollection.findOne({'token':token}, function(err, survey) 
        {
            if( survey )
            {
                db.collection('votes', function(err, voteCollection) {
                    //voteCollection.find({'survey.$id':survey._id}).toArray(function(err, items) {
                    voteCollection.find({'surveyId':survey._id}).toArray(function(err, items) {
                        console.log(err);

                        res.setHeader('Content-disposition', 'attachment; filename=download.json');
                        /*res.writeHead(200, {
                            'Content-Type': 'text/csv'
                        });*/

                        res.send({votes: items});
                    });
                });
            }
            else
            {
                res.send({error: "Could not find survey associated with provided token: " + token});
            }
        });
    });
}


var getClientAddress = function (req) {
    return (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;
};

exports.status = function(req, res)
{
    var surveyId = new ObjectID(req.query.surveyId);
    var ip = getClientAddress(req);
    var fingerprint = req.query.fingerprint;


    db.collection('votes', function(err, collection) {
        collection.find(
        {
            //'survey.$id': surveyId, 
            surveyId: surveyId,
            ip: ip,
            fingerprint: fingerprint
        }).toArray(
            function(err, items) 
            {
                if( items && items.length > 0 )
                {
                    res.send({status:"voted", items: items});
                }
                else
                {
                    res.send({status:"ok"});
                }
            });
    });
}

exports.pickParticipant = function(req, res ) {
    var token = req.params.token;
    console.log(token);

    // get surveyId, then votes matching that.
    db.collection('surveys', function(err, surveyCollection) {
        surveyCollection.findOne({'token':token}, function(err, survey) 
        {
            if( survey )
            {
                // broken?
                //var results = db.executeDbCommand ( { distinct: "votes", key: "email" } );
                // , {'survey.$id':survey._id} 

                db.collection('votes', function(err, voteCollection) {
                    voteCollection.find({'surveyId': survey._id }).toArray(function(err, items) {                    
                    //voteCollection.find({'survey.$id': survey._id }).toArray(function(err, items) {
                        console.log(err);

                        var pool = _.uniq(items, function(item,key,a) {
                                return item.email;
                            }).filter( function(element, index, array) 
                            {
                                try
                                {
                                    return element.email && check(element.email).isEmail();
                                }
                                catch(ex)
                                {
                                    return false;
                                }
                            });

                        if (pool && pool.length > 0 )
                        {
                            // pick random...other fun ways?
                            var winner = pool[Math.floor(Math.random()*pool.length)];
                            res.send({'winner': winner.email});
                        }
                        else
                        {
                            res.send({'winner': 'Error: No valid emails'});
                        }

                    });
                });
            }
        });
    });
};
 
exports.castVote = function(req, res) {

    var surveyId = req.body.surveyId;
    var ip = getClientAddress(req);
    var fingerprint = req.body.fingerprint;
    var answers = req.body.answers;
    var email = req.body.email;
    var contact = req.body.contact;

    var vote = 
    {
	    //survey: {$ref: 'surveys', $id: new ObjectID(surveyId), $db: 'site' },
        surveyId: new ObjectID(surveyId),
        timestamp: new Date(),
        ip: ip,
        fingerprint: fingerprint,
        answers: answers,
        email: email,
        contact: contact
	};

    console.log('Adding vote: ' + vote);

    db.collection('votes', function(err, collection) {
        collection.insert(vote, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send( {'survey_url': '/surveys/?id=' + surveyId, 'done':true });
            }
        });
    });
};
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var votes = [
    {
		  surveyId: '51dd8f9e6e41dc0000000001',
		  timestamp: new Date(),
		  ip: '127.0.0.1',
		  answer: 
		  {
				puppies: 'yes',
			   q1: 'A',
				q2: [1,1,2,3,2,1]
		  },
		  email: 'noname@gmail.com'
    },
    {
		  surveyId: '51dd8f9e6e41dc0000000001',
		  timestamp: new Date(),
		  ip: '127.0.0.1',
		  answer: 
		  {
				puppies: 'no',
			   q1: 'B',
				q2: [1,2,3,3,2,1]
		  },
		  email: 'noname@gmail.com'
    }];

    db.collection('votes', function(err, collection) {
        collection.insert(votes, {safe:true}, function(err, result) {});
    });
 
};
