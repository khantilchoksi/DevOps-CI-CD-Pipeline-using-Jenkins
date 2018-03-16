let subject = require('G:\\CSC 519 - DevOps\\DevOps-Project\\checkbox_test_generation\\server.js');
var request = require("request");
var assert = require('assert');
var sinon = require('sinon')
var mongoose = require('mongoose')
//require('sinon-mongoose');
//var nock = require("nock"); 


request("http://54.202.103.166/api/design/survey" , function(err, rep) { console.log(rep);} ); 
/*request("http://54.202.103.166/api/study/load/:id" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/vote/status" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/status/:id" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/listing" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/create" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/vote/submit/" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/admin/:token" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/admin/download/:token" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/admin/assign/:token" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/admin/open/" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/admin/close/" , function(err, rep) { console.log(rep);} ); 
request("http://54.202.103.166/api/study/admin/notify/" , function(err, rep) { console.log(rep);} ); 
*/