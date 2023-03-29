import Prx from "../../../lib/Prx"

export default class Store {
	config = null
	constructor(config){
		this.config = config
	}
	validateResult(res){
		if(res){
	  		return res.data
	  	}
	  	return null
	}
	async getSentence(pk){
	  	const res = await Prx.get(`${this.config.getApiEndpoint()}/api/tts/sentence?id=${pk}`);
	  	return this.validateResult(res)
	}

	async updateSentenceField(key, value, pk){
		let data = {}
		data[key] = value
		const res = await Prx.post(`${this.config.getApiEndpoint()}/api/tts/sentence?id=${pk}`, data)

		return this.validateResult(res)

	}

	async updateSentence(data, pk){
		const res = await Prx.post(`${this.config.getApiEndpoint()}/api/tts/sentence?id=${pk}`, data)
		return this.validateResult(res)

	}

	async convertTtf(text){
		let ttf = [];
		const res = await Prx.get(`${this.config.getApiEndpoint()}/api/tts/convert?text=${encodeURI(text)}`);
		if(res){
			if(res.data){
				ttf = res.data.map(item=>item.ttf)
			}
		}
		 
		return ttf.join(' ')
	}
}