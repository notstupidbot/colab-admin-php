import Prx from "../../lib/Prx"
import PrxStore from "../../lib/PrxStore"

export default class Store extends PrxStore{
	async getTtsPreferenceList(pageNumber,limit){
		const url = `${this.config.getApiEndpoint()}/api/tts/preferences?page=${pageNumber}&limit=${limit}&group=tts_server`
		const res = await Prx.get(url)

		return this.validateResult(res)
	}
}