//Core / NPM Modules
const _       = require('lodash');
const fs      = require("fs");

var base_url = "localhost:3002";

/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {String} filepath            Path to write test file.
 * @param {Object} routeConstraints Constraints object as returned by `constraints`.
 */
function generateTestCases(filePath, routeConstraints){
    // Content string. This will be built up to generate the full text of the test string.
    let content = `let subject = require('${filePath}');`
    content += `\nvar request = require("request");`;
    content += `\nvar assert = require('assert');`;
    content += `\nvar sinon = require('sinon')`;
    content += `\nvar mongoose = require('mongoose')`;
    content += `\n//require('sinon-mongoose');`;
    content += `\n//var nock = require("nock"); \n\n\n`;

    console.log(routeConstraints);


    routeConstraints.forEach(function(value){
        console.log(value);
        let methodName = value.kind.toUpperCase();
    
        content += `request({ url : '${base_url}${value.routePath}', method: ${methodName}}, function(error, response, body) { console.log(body);} ); \n`;
    });

    

    // Write final content string to file test.js.
    fs.writeFileSync('test.js', content, "utf8");
}


// var myJSONObject = { ... };
// request({
//     url: "http://josiahchoi.com/myjson",
//     method: "POST",
//     json: true,   // <--Very important!!!
//     body: myJSONObject
// }, function (error, response, body){
//     console.log(response);
// });


// Export
module.exports = generateTestCases;