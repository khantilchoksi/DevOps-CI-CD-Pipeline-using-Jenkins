var request = require("request");
var urlRoot = "http://54.202.91.201"
var options = {
    url: urlRoot + "/api/study/load/1",
    method: 'GET'
};

request(options,function(error, response, body){
    if(error)    
        console.log("\n ERROR ", error);
    else{
        console.log("\n RESULT BODY:", body);
    }
});