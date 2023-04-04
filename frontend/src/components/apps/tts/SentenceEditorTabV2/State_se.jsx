import React from "react"
import Store_se from "./Store_se"
/**
 * State_se
 * @component
 * @augments React.Component
 * */ 
class State_se extends React.Component {
	config = null
	pk = null
	row = null
	/**
	 * */
	constructor(props){
		super(props)
		this.pk = props.pk
		this.config = props.config
		this.state = {
			content : '',
			title : '',
			content_ttf : '',
			sentences : '[]',
			unique_id:''
		}
	}
	
	/**
	 * return actual row Object from database result*/
	getRow(){
		return this.row
	}
	/**
	 * update row state object and property
	 * @param {string} 	key field name of sentence row object
	 * @param {any}		value field value of current field needed to updated
	 * */
	updateRow(key, value){
		this.row[key] = value
		let state = {}
		state[key] = value
		console.log(state)
		this.setState(state)
	}
	/**
	 * set and update row state object and property
	 * @param {object} 	row object reprents sentence
	 * */
	setRow(row){
		this.row = row
		const {title, content, sentences, content_ttf, unique_id } = row
		this.setState({title, content, sentences, content_ttf, row, unique_id},()=>{
			this.seiRef.current.buildItems(true)
		})
	}
}

export default State_se