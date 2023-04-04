import State_se from "./State_se"
import Store_se from "./Store_se"

/**
 * Action_se
 * @component
 * @augments State_se
 */ 
class Action_se extends State_se {
	store = null
	constructor(props){
		super(props)
		this.store = new Store_se(this.config)

	}

	/*
	async init(){
		this.loadSentence()
	}
	*/

	/**
	 * return the Store object for remote store jump table */
	getStore(){
		return this.store
	}
	/**
	 * Load sentence from remote*/
	async loadSentence(){
		const row = await this.getStore().getSentence(this.pk)

		if(row){
			this.setRow(row)
		}
		// console.log(this.row)
	}
	/**
	 * componentDidMount event handler 
	 * run the loadSentence() method 
	 * */
	async componentDidMount(){
		this.loadSentence()
	}
}

export default Action_se