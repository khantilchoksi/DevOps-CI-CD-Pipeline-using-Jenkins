//Core / NPM Modules
const _       = require('lodash');
const fs      = require("fs");

var base_url = "http://localhost:3002";

/**
 * Generate test cases based on the global object functionConstraints.
 *
 * @param {String} filepath            Path to write test file.
 * @param {Object} routeConstraints Constraints object as returned by `constraints`.
 */
function generateTestCases(filePath, routeConstraints){
    // Content string. This will be built up to generate the full text of the test string.
    console.log(filePath);
    var content = "";
    for(var i = 0; i < filePath.length; i++){
        console.log('content' + content);
        content += `\n var file${i} = require(${JSON.stringify(filePath[i])});`
    }
    content += `\nvar request = require("request");`;
//    content += `\nvar assert = require('assert');`;
//    content += `\nvar sinon = require('sinon')`;
//    content += `\nvar mongoose = require('mongoose')`;
 //   content += `\n//require('sinon-mongoose');`;
    content += `\n//var nock = require("nock"); \n\n\n`;

    console.log(routeConstraints);


    routeConstraints.forEach(function(value){
        console.log(value);
        let methodName = value.kind.toUpperCase();
        console.log(value.body);
        console.log(typeof JSON.stringify(value.body));

        if(methodName.toString().toUpperCase() == 'GET'.toString().toUpperCase()){
            content += `request({ url : '${base_url}${value.routePath}', method: '${methodName}'}, function(error, response, body) { console.log(body);} ); \n`;
        }
        else{
            let reqBody = value.body;

            content += `request({ url : '${base_url}${value.routePath}', method: '${methodName}', json: ${reqBody}}
            , function(error, response, body) { console.log(body);} ); \n`;
        }
    
    });

    
        content += '\n setTimeout(function() { file0.server.close(); }, 7000);'

    // Write final content string to file test.js.
    fs.writeFileSync('test.js', content, "utf8");
}

function appendTestCases(routeConstraints){
    // Content string. This will be built up to generate the full text of the test string.
    var content = "";
    console.log(routeConstraints);


    routeConstraints.forEach(function(value){
        console.log(value);
        let methodName = value.kind.toUpperCase();
        console.log(value.body);
        console.log(typeof JSON.stringify(value.body));

        if(methodName.toString().toUpperCase() == 'GET'.toString().toUpperCase()){
            content += `request({ url : '${base_url}${value.routePath}', method: '${methodName}'}, function(error, response, body) { console.log(body);} ); \n`;
        }
        else{
            let reqBody = JSON.stringify(value.body);

            content += `request({ url : '${base_url}${value.routePath}', method: '${methodName}', json: ${reqBody.toString()}}
            , function(error, response, body) { console.log(body);} ); \n`;
        }
    
    });

    

    // Write final content string to file test.js.
    fs.appendFileSync('test.js', content, "utf8");
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
exports.generateTestCases = generateTestCases;
exports.appendTestCases = appendTestCases;