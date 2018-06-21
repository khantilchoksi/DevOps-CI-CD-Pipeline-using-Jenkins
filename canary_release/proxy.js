var http = require('http');
var httpProxy = require('http-proxy');
var request = require('request');
var exec = require('child_process').exec;
var fs = require('fs');

let count=0;
let alert = false;

var proxy = httpProxy.createProxyServer({});

prod_url = fs.readFileSync('stableServer').toString();
canary_url = fs.readFileSync('canaryServer').toString();

/** The server running at 3000 port acts as a loadbalancer which sends 
75% of traffic to Stable server and 25% of traffice to canary server*/
http.createServer(function(req,res){
	if(Math.random()>0.75 && !alert){
		console.log("Canary server serving request!");
		proxy.web(req,res,{target: canary_url});
	}
	else{
		console.log("Stable server serving request!");
		proxy.web(req,res,{target: prod_url});
	}
}).listen(3000);


/* Checks health of the canary server every 500ms and raises 'Alert' message
when it cannot reach canary server atleast 4 times */
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