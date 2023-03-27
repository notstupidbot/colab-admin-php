class UiConfig {
	callback_keys = []
	constructor(){
	}

	setHiddenSidebarStatus(status = true){
		const $main_content = $('#main-content')
		
		$main_content.prop('hideSidebar',status)
		$main_content.trigger('hideSidebar')

		localStorage.hideSidebar = status ? '1' : '';
	}

	getHiddenSidebarStatus(){
		if(!localStorage.hideSidebar){
			return false
		}
		return localStorage.hideSidebar === '1'
	}

	applyHiddenSidebarStatus(setHideSidebar, callback, callback_key){
		setHideSidebar(this.getHiddenSidebarStatus())
		if(typeof callback === 'function' ){
			if(!this.callback_keys.includes(callback_key)){
				const $main_content = $('#main-content')
				$main_content.on('hideSidebar', ()=>{
					callback($main_content.prop('hideSidebar'))
				})
			}
			
		}
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
		this.tts_endpoint 		= `http${protoSuffix}://kutukupret:5002`
		this.messaging_endpoint = `ws${protoSuffix}://${this.host}:7001`
	}
}