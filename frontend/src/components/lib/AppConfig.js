import {v4} from "uuid"
/**
 * localStorage Config
 * */
class LsConfig {
	config_key = null
	data = null

	constructor(config_key){
		this.config_key = config_key
		this.init()
	}

	init(){
		if(!this.config_key){
			config_key = `ls_config_${v4()}`
		}
		this.getData()
	}

	setConfigKey(key){
		this.config_key = key
	}
	getData(key){
		try{
			this.data = JSON.parse(localStorage[this.config_key])
		}catch(e){
			if(!this.data){
				this.data = {}
			}
		}
		if(!key)
			return this.data

		if(!this.data[key])
			return null

		return this.data[key]
	}

	setData(key, value){
		this.data[key] = value
		localStorage[this.config_key] = JSON.stringify(this.data)
	}
}
class UiConfig extends LsConfig{
	defaultTheme = 'default-theme.css';

	hiddenSidebar_callback_keys = []
	
	constructor(){
		const config_key = 'uiTtsConfig'
		super(config_key)
		this.setData('defaultTheme', this.defaultTheme)
	}
	
	setHiddenSidebarStatus(status = true){
		const $main_content = $('#main-content')
		
		$main_content.prop('hideSidebar',status)
		$main_content.trigger('hideSidebar')

		this.setData('hideSidebar', status)
	}

	getHiddenSidebarStatus(){
		return this.getData('hideSidebar')
	}

	applyHiddenSidebarStatus(setHideSidebar, callback, callback_key){
		setHideSidebar(this.getHiddenSidebarStatus())
		if(typeof callback === 'function' ){
			if(!this.hiddenSidebar_callback_keys.includes(callback_key)){
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