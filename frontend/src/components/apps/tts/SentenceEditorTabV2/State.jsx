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
			row : null
		}
	}
	/* return actual row from database result */
	getRow(){
		return this.row
	}

	setRow(row){
		this.row = row
	}
}