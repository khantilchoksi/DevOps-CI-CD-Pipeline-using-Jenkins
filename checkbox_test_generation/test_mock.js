var request = require("request");
var study = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\mock_routes\\study.js');
var urlRoot = "http://localhost:3002";
var _ = require('lodash');
const product = require('iter-tools/lib/product');
var new_storyboard = {
    "invitecode" : "RESEARCH",
    "studyKind" : "survey"
};

var ss = {"email":["khchoksi@ncsu.edu"],
            "kind":["AMZN","SURFACE","IPADMINI","GITHUB","BROWSERSTACK"]};





/*console.log(constraints);

    let values =  _.mapValues(constraints, (arr) => _.map(arr, c => c));

console.log(values);
    // Generate possible combinations of arguments
    let argCombinations = product(..._.map(params, p => !_.isEmpty(values[p]) ? values[p] : ["''"]));
    console.log(argCombinations);
*//*

for(var mi in new_storyboard)
    console.log(mi);
console.log(("invitecode" in new_storyboard));
console.log((ss.includes("invitecode")));
*/
/*var nock = require('nock');


var api = nock("http://localhost:3002")
          .get("/api/study/load/1")
          .reply(200, study.loadStudy);

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
});*/