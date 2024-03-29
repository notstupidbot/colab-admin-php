import axios from "axios"
import {v4} from "uuid"
import Helper from "./Helper"

/**
 * PrxCache
 * ProxyHttp with local cache
 * */
class PrxCache {
	age = 0
	result = null
	key = null
	maxAge = 1000
	birth = null
	data = null
	reqCount = 0
	constructor(key){
		this.birth = new Date
		this.key = key
	}

	setResult(result){
		this.reqCount = 0

		this.birth = new Date

		// console.log(result)
		this.result = result
		this.data = JSON.stringify(result.data)
	}

	calculateAge(){
		// this.birth = new Date
		const currentDate = new Date
		this.age = currentDate - this.birth
	}

	getResult(){
		if(this.result){
			// this.reqCount = 0;
			this.result.data = JSON.parse(this.data)
		}
		return this.result
	}

	getAge(){
		return this.age
	}

	hit(){
		this.calculateAge()
		return this.age < this.maxAge
	}

	validate(){
		if(this.reqCount > 0){
			return true
		}
		let validResult = typeof this.result == 'object'
		const hit = this.hit()
		try{
			validResult = this.result.status == 200
		}catch(e){
			validResult = false
		}

		return validResult  && hit
	}

	resetOnRequest(){
		this.reqCount = 0
		this.calculateAge()
	}
	setOnRequest(){
		this.reqCount += 1
		const delay = Helper.makeDelay(this.maxAge)
		delay(()=>{
			this.resetOnRequest()
		})
	}
}
/**
 * Prx
 * Axios capsules with Caching support
 * */
class Prx {
	static caches = {}
	static async request(options){

	}
	/**
	 * perform http get
	 * */
	static async get(url){
		const key = Helper.underscore(url);
		// console.log(key)
		if(typeof Prx.caches[key] != 'object'){
			Prx.caches[key] = new PrxCache(key);
		}

		if(Prx.caches[key].validate()){
			// console.log(`Cached ${Prx.caches[key].age}`)
			const res =  Prx.caches[key].getResult()
			// console.log(res)
			return res
		}
		Prx.caches[key].setOnRequest()
		const res = await axios.get(url)
		
		Prx.caches[key].setResult(res);

		return res
	}
	/**
	 * perform http post
	 * */
	static async post(url, data){
		const formData = new FormData();
		for(let key in data){
			const value = data[key]
			formData.append(key, value)
		}
		const res = await axios({
			method: "post",
			url,
			data: formData,
			headers: { "Content-Type": "multipart/form-data" },
		});
	}
}

export default Prx 