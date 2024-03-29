import {v4} from "uuid"
/**
 * localStorage 
 * key value serialized Config
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
	/**
	 * set unique config key for localStorage key
	 * */
	setConfigKey(key){
		this.config_key = key
	}
	/**
	 * get data by key
	 * */
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
	/**
	 * set data by key
	 * */
	setData(key, value){
		this.data[key] = value
		localStorage[this.config_key] = JSON.stringify(this.data)
	}
}
/**
 * UiConfig
 * */
class UiConfig extends LsConfig{
	defaultTheme = 'default-theme.css';

	hiddenSidebar_callback_keys = []
	
	constructor(){
		const config_key = 'uiTtsConfig'
		super(config_key)
		this.setData('defaultTheme', this.defaultTheme)
	}
	/**
	 * set sidebar hidden or shown
	 * */
	setHiddenSidebarStatus(status = true){
		const $main_content = $('#main-content')
		
		$main_content.prop('hideSidebar',status)
		$main_content.trigger('hideSidebar')

		this.setData('hideSidebar', status)
	}
	/**
	 * get sidebar hidden or shown status
	 * */
	getHiddenSidebarStatus(){
		return this.getData('hideSidebar')
	}
	/**
	 * apply callback handler on event sidebar hidden or shown change
	 * @param {function} setHideSidebar hook state function
	 * @param {function} callback function to run after event fired
	 * @param {string} callback_key identifier for eliminate duplication
	 * 
	 * @example
	 * function Component(){
	 * 	const [hideSidebar,setHideSidebar] = useState(false)
		useEffect(()=>{
	    	config.getUiConfig().applyHiddenSidebarStatus(setHideSidebar,(status)=>{
		      console.log(status)
		      setHideSidebar(status)
		    },'template')
	  	},[])
	 * }
 	 * */
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
/**
 * AppConfig
 * class for storing Application Config and state
 * */
class AppConfig {
	mode 			= 'development'
	host 			= null
	api_endpoint	= null;
	push_endpoint 	= null;
	tts_endpoint 	= null;
	messaging_endpoint = null;

	uiConfig = null

	static instance = null
	/**
	 * get singleton instance */
	static getInstance(){
		if(AppConfig.instance instanceof AppConfig){
		}else{
			AppConfig.instance = AppConfig.factory();
		}	

		return AppConfig.instance;
	}
	/**
	 * singleton factory*/
	static factory(){
		return new AppConfig()
	}
	/**
	 * @constructor
	 * */
	constructor(){
		this.host = this.getClientHostName()
		this.setDefultEndpoint()
		this.uiConfig = new UiConfig();
	}
	/**
	 * get UiConfig instance
	 * @return {UiConfig} */
	getUiConfig(){
		return this.uiConfig;
	}
	/**
	 * get current API Endpoint
	 * */
	getApiEndpoint(){
		return this.api_endpoint
	}
	/**
	 * get current PUSH / Socket.io server Endpoint
	 * */
	getPushEndpoint(){
		return this.push_endpoint
	}
	/**
	 * get current Messaging Endpoint
	 * */
	getMessagingEndpoint(){
		return this.messaging_endpoint
	}
	/**
	 * get current Tts Server Endpoint
	 * */
	getTtsEndpoint(){
		return this.tts_endpoint
	}
 	/**
	 * get current host of browser
	 * */
	getHost(){
		return this.host;
	}
	/**
	 * get current hostname without port
	 * */
	getClientHostName(stripPort = true){
		const hostName = document.location.host

		if(stripPort){
			return hostName.replace(/\:\d+$/,'')
		}

		return hostName;
	}
	/**
	 * set default Endpoint based on current url in the current browser
	 * */
	setDefultEndpoint(secure = false){
		const protoSuffix = secure ? 's' : ''
		this.api_endpoint 		= `http${protoSuffix}://${this.host}:8000`
		this.push_endpoint 		= `http${protoSuffix}://${this.host}:7000`
		this.tts_endpoint 		= `http${protoSuffix}://kutukupret:5002`
		this.messaging_endpoint = `ws${protoSuffix}://${this.host}:7001`
	}
}

export default AppConfig