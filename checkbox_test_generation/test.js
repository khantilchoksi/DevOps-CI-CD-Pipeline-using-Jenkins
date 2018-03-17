require('/Users/khantil/Developer/MCSStudy/DevOps/Project/DevOps-Project/checkbox_test_generation/server.js');
var request = require("request");
var assert = require('assert');
var sinon = require('sinon')
var mongoose = require('mongoose')
//require('sinon-mongoose');
//var nock = require("nock"); 


request({ url : 'http://localhost:3002/api/design/survey', method: 'POST'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/load/:id', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/vote/status', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/status/:id', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/listing', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/create', method: 'POST'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/vote/submit/', method: 'POST'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/:token', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/download/:token', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/assign/:token', method: 'GET'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/open/', method: 'POST'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/close/', method: 'POST'}, function(error, response, body) { console.log(body);} ); 
request({ url : 'http://localhost:3002/api/study/admin/notify/', method: 'POST'}, function(error, response, body) { console.log(body);} ); 
