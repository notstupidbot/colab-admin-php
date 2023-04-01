import Prx from "../../lib/Prx"
import PrxStore from "../../lib/PrxStore"

export default class Store extends PrxStore{
	async getTtsPreferenceList(pageNumber,limit,orderBy, orderDir){
		const url = `${this.config.getApiEndpoint()}/api/tts/preferences?page=${pageNumber}&limit=${limit}&group=tts_server&order_by=${orderBy}&order_dir=${orderDir}`
		const res = await Prx.get(url)

		return this.validateResult(res)
	}
}