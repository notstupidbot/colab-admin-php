let config = {
	mode : 'development',
	host : document.location.host.replace(/\:\d+$/,'')
};
config.api_endpoint = `http://${config.host}`;
config.push_endpoint = `http://${config.host}:7000`;
config.zmq_endpoint = `ws://${config.host}:7001`;

config.getApiEndpoint =()=>{
	return config.api_endpoint;
}

config.getPushEndpoint=()=>{
	return config.push_endpoint;
}

config.getZmqEndpoint=()=>{
	return config.zmq_endpoint;
}

export default config;