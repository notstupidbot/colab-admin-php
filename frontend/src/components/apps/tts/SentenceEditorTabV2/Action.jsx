import State from "./State"
import Store from "./Store"

 
export default class Action extends State {
	constructor(props){
		super(props)
		// this.init()
	}

	async init(){
		this.loadSentence()
	}

	async loadSentence(){
		const row = await this.store.getSentence(this.pk)

		if(row){
			this.setRow(row)
		}
		// console.log(this.row)
	}
	
	async componentDidMount(){
		this.loadSentence()
	}
}