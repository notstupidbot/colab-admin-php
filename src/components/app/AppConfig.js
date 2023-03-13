class UiConfig {
	hidenSidebarStatus = false
	setHideSidebar = (status) => {}
	constructor(){

	}

	hideSidebar(status = true){
		this.hideSidebar = status;
		this.setHideSidebar(status)
	}

	setHideSidebarState(setHideSidebar){
		this.setHideSidebar = setHideSidebar
	}


}

export default class AppConfig {
	mode 			= 'development'
	host 			= null
	api_endpoint	= null;
	push_endpoint 	= null;
	tts_endpoint 	= null;
	messaging_endpoint = null;

	uiConfig = null

	static instance = null

	static getInstance(){
		if(AppConfig.instance instanceof AppConfig){
		}else{
			AppConfig.instance = AppConfig.factory();
		}	

		return AppConfig.instance;
	}
	
	static factory(){
		return new AppConfig()
	}

	constructor(){
		this.host = this.getClientHostName()
		this.setDefultEndpoint()
		this.uiConfig = new UiConfig();
	}

	getUiConfig(){
		return this.uiConfig;
	}
	getApiEndpoint(){
		return this.api_endpoint
	}

	getPushEndpoint(){
		return this.push_endpoint
	}

	getMessagingEndpoint(){
		return this.messaging_endpoint
	}

	getTtsEndpoint(){
		return this.tts_endpoint
	}
 
	getHost(){
		return this.host;
	}
	getClientHostName(stripPort = true){
		const hostName = document.location.host

		if(stripPort){
			return hostName.replace(/\:\d+$/,'')
		}

		return hostName;
	}

	setDefultEndpoint(secure = false){
		const protoSuffix = secure ? 's' : ''
		this.api_endpoint 		= `http${protoSuffix}://${this.host}`
		this.push_endpoint 		= `http${protoSuffix}://${this.host}:7000`
		this.tts_endpoint 		= `http${protoSuffix}://${this.host}:5002`
		this.messaging_endpoint = `ws${protoSuffix}://${this.host}:7001`
	}
}