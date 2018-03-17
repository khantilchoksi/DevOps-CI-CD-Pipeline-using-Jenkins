var request = require("request");
var urlRoot = "http://54.202.91.201";
var new_storyboard = {
    "invitecode" : "RESEARCH",
    "studyKind" : "survey"
};

var options = {
    url: urlRoot + "/api/study/load/5aabf0042ceed7549c53a386",
    method: 'GET'
};

request({
    url: urlRoot + "/api/study/load/5aabf0042ceed7549c53a386",
    method: 'GET'
},function(error, response, body){
    if(error)    
        console.log("\n ERROR ", error);
    else{
        console.log("\n RESULT BODY:", body);
    }
});