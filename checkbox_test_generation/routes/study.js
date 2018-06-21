var mongo = require('mongodb');
var check = require('validator').check;
var _ = require('underscore');
var fileService = require('./upload.js');

var Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;
 

var MongoClient = mongo.MongoClient;
var db = null;
MongoClient.connect("mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@"+process.env.MONGO_IP+":27017/site?authSource=admin", function(err, authdb) {
  // Now you can use the database in the db variable
  db = authdb;
  console.log( err || "connected!" );
});

exports.listing = function(req, res)
{
    db.collection('votes', function(err, votes) {

        db.collection('studies', function(err, studies ) {

            studies.find().toArray(
                function(err, studyItems) 
                {
                    console.log(err);
                    votes.aggregate(
                    [
                        { $group: { _id: '$studyId', votes: { $sum: 1 } } }
                    ], 
                    function(err, groupResult) 
                    {
                        console.log(err + ":" + groupResult);

                        var voteMap = {};
                        var result = {studies:[]};
                        for( var i = 0; i < groupResult.length; i++ )
                        {
                            var g = groupResult[i];
                            if( g._id != null )
                            {
                                voteMap[g._id] = g.votes;
                            }
                        }

                        console.log( JSON.stringify(voteMap) );

                        for( var i = 0; i < studyItems.length; i++ )
                        {
                            var s = studyItems[i];
                            if( voteMap[s._id] )
                            {
                                var study = {
                                    id: s._id, 
                                    votes: voteMap[s._id],
                                    name: s.name,
                                    status: s.status,
                                    goal: s.goal,
                                    awards: s.awards,
                                    studyKind: s.studyKind,
                                    link: s.publicLink,
                                    results: s.results,
                                    description: s.description                                    
                                };

                                if( s.skipListing )
                                {
                                    // skip
                                }
                                else
                                {
                                    result["studies"].push( study );
                                }
                            }
                        }

                        statusPriority = 
                        {
                            open: 0, awarded: 1, closed: 2
                        };

                        result.studies.sort(function(a,b)
                        {
                            var aPriority = statusPriority[a.status];
                            var bPriority = statusPriority[b.status];

                            return aPriority - bPriority;
                        });

                        res.send(result);
                    });
                }
            );
        });
    });
}

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

exports.status = function(req, res) {
    var studyId = new ObjectID(req.params.id);

    db.collection('votes', function(err, collection) {
        collection.find({'studyId':studyId}).toArray(function(err, items) {            
            res.send({votes: items.length});
        });
    });
};


exports.voteStatus = function(req, res)
{
    var studyId = new ObjectID(req.query.studyId);
    var ip = getClientAddress(req);
    var fingerprint = req.query.fingerprint;


    db.collection('votes', function(err, collection) {
        collection.find(
        {
            studyId: studyId,
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

exports.submitVote = function(req, res) {

    var studyId = req.body.studyId;
    var ip = getClientAddress(req);
    var fingerprint = req.body.fingerprint;
    var answers = JSON.parse(req.body.answers);
    var email = req.body.email;
    var contact = req.body.contact;

    var vote = 
    {
        studyId: new ObjectID(studyId),
        timestamp: new Date(),
        ip: ip,
        fingerprint: fingerprint,
        answers: answers,
        email: email,
        contact: contact
    };

    if( req.files && req.files.files && req.files.files.length > 0 )
    {
        fileService.uploadFiles( req, function(results) {
            console.log( results );
            vote.files = results;
            commonSubmit(req,res, vote);
        });
    }
    else
    {    
        commonSubmit(req,res, vote);
    }

}

function commonSubmit(req, res, vote )
{

    console.log('Adding vote: ' + vote);

    db.collection('votes', function(err, collection) {
        collection.insert(vote, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send( {'done':true });
            }
        });
    });
}

var getClientAddress = function (req) {
    return (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;
};
