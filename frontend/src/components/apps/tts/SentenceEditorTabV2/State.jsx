import React from "react"
import Store from "./Store"
export default class State extends React.Component {
	config = null
	store = null
	pk = null
	row = null

	constructor(props){
		super(props)
		this.pk = props.pk
		this.config = props.config
		this.store = new Store(this.config)
		this.state = {
			content : '',
			title : '',
			content_ttf : '',
			sentences : '[]',
			unique_id:''
		}
	}
	/* return actual row from database result */
	getRow(){
		return this.row
	}
	updateRow(key, value){
		this.row[key] = value
		let state = {}
		state[key] = value
		console.log(state)
		this.setState(state)
	}
	setRow(row){
		this.row = row
		const {title, content, sentences, content_ttf, unique_id } = row
		this.setState({title, content, sentences, content_ttf, row, unique_id},()=>{
			this.seiRef.current.buildItems(true)
		})

		// this.setState({sentences:'[]'},()=>{
		// 	setTimeout(()=>{
		// 		this.setState({sentences},()=>{
		// 			console.log('B')
		// 			this.seiRef.current.buildItems(true)
		// 		})
		// 	},5000)
		// })
	}
}