import Prx from "../../../lib/Prx"
import PrxStore from "../../../lib/PrxStore"
import {v4} from "uuid"
/**
 * Store_se
 * @component
 * @augments PrxStore
 * */
class Store_se extends PrxStore{
	/**
	 * return JSON formated sentence data
	 * @pk 		{string}	pk		hash string represent id of the table row
	 */
	async getSentence(pk){
	  	const res = await Prx.get(`${this.config.getApiEndpoint()}/api/tts/sentence?id=${pk}`);
	  	if(res){
			let data = res.data
			data.unique_id = v4()

			return data
		}
		return null
	}
	/**
	 * return JSON formated sentence data
	 * @key 	{string} 	key 	string represent field name of sentence table schema
	 * @value 	{string} 	value 	string will be stored as new value as update sentence table schema
	 * @pk 		{string}	pk		hash string represent id of the table row
	 */
	async updateSentenceField(key, value, pk){
		let data = {}
		data[key] = value
		const res = await Prx.post(`${this.config.getApiEndpoint()}/api/tts/sentence?id=${pk}`, data)

		return this.validateResult(res)

	}
	/**
	 * return JSON formated sentence data
	 * @param 	{object} 	data 	object represent FormData from sentence table schema
	 * @pk 		{string}	pk		hash string represent id of the table row
	 */
	async updateSentence(data, pk){
		const res = await Prx.post(`${this.config.getApiEndpoint()}/api/tts/sentence?id=${pk}`, data)
		return this.validateResult(res)

	}
	/**
	 * return Convert indonesian latin word to g2p id format remotely
	 * @param {string} Text to convert with 
	 * @return {string} Output Utf-8 text g2p id format string 
	 * 
	 */
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

export default Store_se