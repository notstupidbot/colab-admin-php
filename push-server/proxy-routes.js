
var url = require('url');
var http = require('http');
var { SocksProxyAgent } = require('socks-proxy-agent');




function ProxyRoute(socketManager,app){
	// SOCKS proxy to connect to
	var proxy = process.env.socks_proxy || 'socks://127.0.0.1:1080';
	console.log('using proxy server %j', proxy);
	var proxy = 'socks://127.0.0.1:1081';
	console.log('using proxy server %j', proxy);
	var agent = new SocksProxyAgent(proxy);


	
	app.use(/^\/proxy\/(.*)/,async(req,res,next)=>{
		
		try{
			
			const path = req.originalUrl.replace(/^\/proxy\//,'');
			var endpoint = 'http://localhost'
			const realPath = `${endpoint}/${path}`;

			var opts = url.parse(realPath);
			opts.agent = agent;
			
			console.log(`proxyng:${realPath}`)
			http.get(opts, function (res_) {
				res_.pipe(res);
			})
		}catch(e){
			console.log(e)
		}
		
		
	})
}

module.exports = ProxyRoute;