var request = require("request");
var urlRoot = "http://localhost:3002";
var new_storyboard = {
    "invitecode" : "RESEARCH",
    "studyKind" : "survey"
};

var options = {
    url: urlRoot + "/api/study/load/1",
    method: 'GET'
};

request({
    url: urlRoot + "/api/study/load/1",
    method: 'GET'
},function(error, response, body){
    if(error)    
        console.log("\n ERROR ", error);
    else{
        console.log("\n RESULT BODY:", body);
    }
});