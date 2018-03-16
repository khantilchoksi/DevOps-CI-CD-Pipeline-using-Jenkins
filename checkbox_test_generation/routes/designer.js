var mongo = require('mongodb');
var crypto = require('crypto');
var emailjs = require('emailjs/email');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var emailServer  = emailjs.server.connect({
   user:    "supportemail@domain.com", 
   password:"supportpwd", 
   host:    "smtp.gmail.com", 
   ssl:     true
});

var MongoClient = mongo.MongoClient;
var db = null;
MongoClient.connect("mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@"+process.env.MONGO_IP+":27017/site?authSource=admin", function(err, authdb) {
  // Now you can use the database in the db variable
  db = authdb;
  console.log( err || "connected!" );
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving surveys: ' + id);
    db.collection('surveys', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            // don't allow token to be seen by others.
            item.token = null;
            res.send(item);
        });
    });
};

exports.findByToken = function(req, res) {
    var token = req.params.token;
    console.log('Retrieving surveys by token: ' + token);
    db.collection('surveys', function(err, collection) {
        collection.findOne({'token':token}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAllByOwner = function(req, res) {
    var name = req.params.id;
    console.log('Retrieving surveys owned by: ' + name);
    db.collection('surveys', function(err, collection) {
        collection.find({'OWNER': name}).toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('surveys', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.studyListing = function(req, res)
{
    db.collection('votes', function(err, votes) {

        db.collection('surveys', function(err, surveys ) {

            surveys.find().toArray(
                function(err, surveyItems) 
                {
                    console.log(err);
                    votes.aggregate(
                    [
                        { $group: { _id: '$surveyId', votes: { $sum: 1 } } }
                    ], 
                    function(err, groupResult) 
                    {
                        console.log(err + ":" + groupResult);

                        var voteMap = {};
                        var result = {surveys:[]};
                        for( var i = 0; i < groupResult.length; i++ )
                        {
                            var g = groupResult[i];
                            if( g._id != null )
                            {
                                voteMap[g._id] = g.votes;
                            }
                        }

                        for( var i = 0; i < surveyItems.length; i++ )
                        {
                            var s = surveyItems[i];
                            if( voteMap[s._id] )
                            {
                                var study = {
                                    id: s._id, 
                                    votes: voteMap[s._id],
                                    name: s.name,
                                    status: s.status,
                                    goal: s.goal,
                                    awardKind: s.awardKind,
                                    awardDescription: s.awardDescription,
                                    description: s.description                                    
                                };
                                result["surveys"].push( study );
                            }
                        }

                        res.send(result);
                    });
                }
            );
        });
    });

}




exports.openSurvey = function(req, res) {
    var token = req.body.token;
    db.collection('surveys', function(err, collection) {
        collection.findOne({'token':token}, function(err, survey) {

            collection.update( {'_id' : survey._id}, 
                     {'$set' : {'status' : 'open'}});

            res.send({status:'ok'});
        });
    });
}


exports.closeSurvey = function(req, res) {
    var token = req.body.token;
    db.collection('surveys', function(err, collection) {
        collection.findOne({'token':token}, function(err, survey) {

            collection.update( {'_id' : survey._id}, 
                     {'$set' : {'status' : 'closed'}});

            res.send({status:'ok'});
        });
    });
}

exports.notifyParticipant = function(req, res) {
    var email = req.body.email;
    var kind = req.body.kind;

    var redeem = "The researcher will follow up with more instructions on how to receive your compensation.";
    if( kind == "AMZN" )
    {
        redeem = "Your amazon gift card will be sent directly from amazon.com.";
    }
    else if( kind == "SURFACE" )
    {
        redeem = "Your Microsoft surface will be sent as soon as you reply back with your shipping address.";
    }
    else if( kind == "IPADMINI" )
    {
        redeem = "Your iPad Mini will be sent as soon as you reply back with your shipping address.";
    }
    else if( kind == "GITHUB" )
    {
        redeem = "Your github swag will be sent as soon as you reply back with your shipping address.";
    }
    else if( kind == "BROWSERSTACK" )
    {
        redeem = "Your browserstack token will be in another email.";
        // TODO include in ...
    }


    emailServer.send({
            text: "Thank you for participating in our research study.\n" +
                  redeem + "\n"
            , 
            from:    "support <support@checkbox.io>",
            to:      "<"+ email +">",
            //to: "<cscorley@gmail.com>",
            //cc:      "else <else@gmail.com>",
            subject: "checkbox.io: survey winner"
        }, 
        function(err, message) 
        { 
            console.log(err || message); 
            res.send( {message: err || message });
        }
    );

}
 
exports.saveSurvey = function(req, res) {

    var name = req.body.name;
    var owner = req.body.owner;
    var contact = req.body.contact;
    var invitecode = req.body.invitecode; 
    var goal = req.body.goal;
    var markdown = req.body.markdown;

    var award = req.body.award;
    var awardDescription = req.body.awardDescription;
    var description = req.body.description;


    if( invitecode != "RESEARCH" )
    {
        res.send({'error':'Invalid invitecode'});
        return;
    }

    goal = parseInt(goal) || 100;

    crypto.randomBytes(48, function(ex, buf) 
    {
        // alternative: https://github.com/broofa/node-uuid
        var token = buf.toString('hex');

        var survey = 
        {
            name: name,
            owner: owner,
            contact: contact,
            markdown: markdown,
            invitecode:invitecode,
            goal: goal,
            token: token,
            awardKind: award,
            awardDescription: awardDescription,
            description: description
        };

        console.log('Adding survey: ' + name);


        db.collection('surveys', function(err, collection) {
            collection.insert(survey, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } 
                else 
                {
                    console.log('Success: ' + JSON.stringify(result[0]));

                    res.send({'survey_url': '/surveys/?id=' + result[0]._id,
                        'admin_url': '/surveys/admin/?token='+ token
                    });


                    emailServer.send({
                        text: "Your survey has been created.\n" +
                              "Survey admin url:\n" + 
                              "http://checkbox.io/surveys/admin/?token="+ token + "\n" +
                              "Public survey url: \n" + 
                              "http://checkbox.io/surveys/?id=" + result[0]._id + "\n"
                            , 
                            from:    "Chris Parnin <chris.parnin@gmail.com>", 
                            to:      owner + "<"+ contact +">",
                            subject: "checkbox.io: survey created"
                        }, 
                        function(err, message) 
                        { 
                            console.log(err || message); 
                        }
                    );

                }
            });
        });
    });
};
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var surveys = [
    {
        name: "TEST SURVEY",
        owner: "SYSTEM",
        contact: "chris.parnin@gmail.com",
        markdown: "{NumberQuestions:true}\n-----\n### Test Question\n- List\n- Choice\n- C",
        invitecode:"RESEARCH"
    },
    {
        name: "TEST SURVEY II",
        owner: "SYSTEM",
        contact: "chris.parnin@gmail.com",
        markdown: "{NumberQuestions:true}\n-----\n### Test Question\n1. List\n2. Choice\n3. C",
        invitecode:"RESEARCH"
    }];


    db.collection('surveys', function(err, collection) {
        collection.insert(surveys, {safe:true}, function(err, result) {});
    });
 
};
