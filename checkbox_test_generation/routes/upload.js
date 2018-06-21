var express = require('express');
var fs = require("fs");
var async = require("async");

var mongo = require('mongodb');
var check = require('validator').check;
var _ = require('underscore');

var archiver = require('archiver');


var Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;

var MongoClient = mongo.MongoClient;
var db = null;
MongoClient.connect("mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASSWORD+"@"+process.env.MONGO_IP+":27017/site?authSource=admin", function(err, authdb) {
  // Now you can use the database in the db variable
  db = authdb;
  console.log( err || "connected!" );
});

exports.uploadFiles = function(req, onReady)
{
	var files = req.files.files;

	async.map( files, uploadFile, function(err, results)
	{
		onReady( results );
	});
};

exports.readFiles = function(res, fileIds, onReady)
{
    var archive = archiver('zip');

    archive.on('error', function(err) {
  		throw err;
	});

    archive.pipe( res );

	async.map( fileIds.map(function(elem){ return {fileId:elem,archive:archive} }), readFileStream, function(err, results) 
	{
	 	onReady(err, archive);
	});
}

function readFileStream(obj, onReady)
{
	var fileId = obj.fileId;
	var archive = obj.archive;

	new mongo.GridStore(db, fileId, "r").open(function(err, gridStore)
    {
		var stream = gridStore.stream(true);
		//console.log("streaming: " + fileId );

        stream.on("data", function(item) {
            // Destroy the stream
        	//stream.destroy();
        	//console.log("data: " + fileId);
        });

        stream.on("end", function(item) {
        	//console.log("Stream end: " + fileId);
        });

        stream.on("close", function() {
        	//console.log("Stream closed: " + fileId);
        });

	 	archive.append( stream, { name: fileId + "-" + gridStore.filename }, function()
 	 	{
 	 		console.log("appended: " + gridStore.filename);
 	 	});

		onReady(err, fileId);
	});
}

function readFile(fileId, onReady)
{
	// Read back all the written content and verify the correctness
	mongo.GridStore.read(db, fileId, function(err, fileData) 
	{
		console.log( fileData.length );
		onReady(err, {fileId:fileId, data: fileData});
	});
}

function uploadFile(file, onReady)
{

	var fileId = new ObjectID();

	var gs = new mongo.GridStore(db, fileId, file.name, "w", {
	    "content_type": file.type,
	    "chunk_size": 1024*8
	});

	gs.open(function(err, gs)
	{
		gs.writeFile(file.path, function(err, a) 
		{
			console.log(err + ": wrote file");

			gs.close(function(err,result)
			{
				// Read back all the written content and verify the correctness
				mongo.GridStore.read(db, fileId, function(err, fileData) {
					console.log(err);
					if( fileData )
						console.log(fileData.length);

					onReady(err, {fileId:fileId});
				});
			});

		});
	});

}
