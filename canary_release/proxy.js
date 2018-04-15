var http = require('http');
var httpProxy = require('http-proxy');
var request = require('request');
var exec = require('child_process').exec;

var proxy = httpProxy.createProxyServer({});
let count=0;
let alert = false;

exec("node prod-env.js");
exec("node canary-env.js");

prod_url = 'http://localhost:9000';
canary_url = 'http://localhost:9001';

http.createServer(function(req,res){
	if(Math.random()>0.75 && !alert){
		proxy.web(req,res,{target: canary_url});
	}
	else{
		proxy.web(req,res,{target: prod_url});
	}
}).listen(3000);


var heartbeatTimer = setInterval( function () 
{
	var options = 
	{
		url: canary_url
	};

	request(options, function (error, res, body) 
	{
		if(!error && res.statusCode==200)
		{
			count=0;
			alert=false;
		}
		else{
			if(count!=Number.MAX_VALUE)
				count++;
		}
		if(count>=4){
			console.log("Alert!!! Canary server is not reachable!");
			alert = true;
		}
			
	});
}, 500);