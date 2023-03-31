export default class PrxStore {
	config = null
	constructor(config){
		this.config = config
	}
	setConfig(config){
		this.config = config
	}
	getConfig(){
		return this.config
	}
	validateResult(res){
		if(res){
	  		return res.data
	  	}
	  	return null
	}
}