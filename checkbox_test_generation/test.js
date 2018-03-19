
 var file0 = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\server.js');
 var file1 = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\mock_routes\\admin.js');
 var file2 = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\mock_routes\\study.js');
 var file3 = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\mock_routes\\create.js');
var request = require("request");
//var nock = require("nock"); 


request({ url : 'http://localhost:3002/api/design/survey', method: 'POST', json: {"markdown":"\n{NumberQuestions:true}\n-------"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/load/4', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/vote/status', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/status/3', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/listing', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/create', method: 'POST', json: {"invitecode":"RESEARCH","studyKind":"survey"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/create', method: 'POST', json: {"invitecode":"RESEARCH","studyKind":"dataStudy"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/4', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/download/3', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/assign/1', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"1"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"2"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"3"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST', json: {"token":"4"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"1"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"2"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"3"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST', json: {"token":"4"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"AMZN"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"SURFACE"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"IPADMINI"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"GITHUB"}}
            , function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST', json: {"email":"khchoksi@ncsu.edu","kind":"BROWSERSTACK"}}
            , function(error, response, body) { console.log(body);} ); 

 setTimeout(function() { file0.server.close(); }, 15000);