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
		this.row = await this.store.getSentence(this.pk)

		if(this.row){
			this.setState({row : this.row})
		}
		// console.log(this.row)
	}
	
	async componentDidMount(){
		this.loadSentence()
	}
}