var http = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;

var proxy = httpProxy.createProxyServer({});
let count=0;

exec("node prod-env.js");
exec("node canary-env.js");

http.createServer(function(req,res){
	count++;
	if(count==4)
		count=0;
	if(count==3){
		proxy.web(req,res,{target: 'http://localhost:9001'});
	}
	else{
		proxy.web(req,res,{target: 'http://localhost:9000'});
	}
}).listen(3000);