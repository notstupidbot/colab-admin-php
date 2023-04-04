/**
 * PrxStore
 * Predefine store class for React Component
 * */
class PrxStore {
	config = null
	/**
	 * @param {AppConfig} 
	 * */
	constructor(config){
		this.config = config
	}
	/**
	 * @param {AppConfig} 
	 * */
	setConfig(config){
		this.config = config
	}
	/**
	 * @return {AppConfig} 
	 * */
	getConfig(){
		return this.config
	}
	/**
	 * validate axios http result
	 * @param {object} 
	 * */
	validateResult(res){
		if(res){
	  		return res.data
	  	}
	  	return null
	}
}

export default PrxStore