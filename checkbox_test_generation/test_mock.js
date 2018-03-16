var request = require("request");
var urlRoot = "http://54.202.91.201";
var new_storyboard = {
    "invitecode" : "RESEARCH",
    "studyKind" : "survey"
};

var options = {
    url: urlRoot + "/api/study/load/1",
    method: 'GET',
    json: new_storyboard,
    headers: {
        "content-type": "application/json"
    }
};

request(options,function(error, response, body){
    if(error)    
        console.log("\n ERROR ", error);
    else{
        console.log("\n RESULT BODY:", body);
    }
});