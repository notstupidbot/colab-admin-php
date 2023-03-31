import React, {useState} from "react"
import Prx from "../../lib/Prx"
const inputCls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"

class PrefEditor extends React.Component {
	item = null
	key = null
	type = null
	editor = null
	group = null
	prop = null
	// index = null
	// pk = null
	gridAction = null
	constructor(props){
		super(props)
		this.item = props.item
		if(props.item){
			const {key,type,editor,group,prop} = this.item
			this.key = key
			this.type = type
			this.editor = editor
			this.group = group
			this.prop = prop
			this.obj = JSON.parse(this.item.val)
			this.state = {
				obj : this.obj,
				value : this.obj[this.prop],
				editMode : false

			}	
		}
	}

	editRow(){
		this.setState({editMode:true})
		this.gridAction.setState({editMode:true})

	}
	serializeObj(){
		this.obj[this.prop] = this.state.value
		this.item.val = JSON.stringify(this.obj)
	}
	async saveRow(){
		console.log(this.item.val)
		const postData = {
			val : this.item.val
		}
		const params = {
			key : this.item.key,
			group : this.item.group
		}
		console.log(postData)
		console.log(params)
		if(this.gridAction){
			const remoteUrl = typeof this.gridAction.props.options.remoteUrl == 'function' ? this.gridAction.props.options.remoteUrl(this.item) : this.gridAction.props.options.remoteUrl
			const data = await Prx.post(remoteUrl, postData)
			console.log(remoteUrl)
		}
		
		this.cancelRow()

	}
	cancelRow(){
		this.setState({editMode:false})
		if(this.gridAction){
			this.gridAction.setState({editMode:false})
		}
	}
	setGridAction(gridAction){
		this.gridAction = gridAction
	}
	
}
class PrefEditorBoolean extends PrefEditor{
	
	constructor(props){
		super(props)
		this.state.isChecked = this.obj[this.prop]
		
	}
 
 
	render(){
		if(this.item)
			return(<>
				{this.state.isChecked?"Yes":"No"}
			</>)	
	}
	
}

class PrefEditorString extends PrefEditor{
	constructor(props){
		super(props)
		this.state.length = this.state.value.length
		
	}
 
 	onKeyUp(e){
 		if(e.keyCode == 13){
 			console.log(`Enter Detected`)
 			this.saveRow()
 		}
 		else if(e.keyCode == 27){
 			console.log(`Esc Detected`)
 			this.cancelRow()

 		}
 		console.log(e.keyCode)
 	}
 	onChange(e){
 		const value = e.target.value
 		this.setState({value},()=>{
 			this.serializeObj()
 		})
 	}
	render(){
		if(this.item){
			return(<>
			{
				this.state.editMode ? (<>
					<input className={inputCls} type="text" defaultValue={this.state.value} onKeyUp={e=>this.onKeyUp(e)} onChange={e=>this.onChange(e)}/>
				</>): (<>
					{this.state.value}
				</>)
			}
				
			</>)
		}
	}
} 

class PrefEditorObject extends PrefEditor{
	constructor(props){
		super(props)
		// this.state = {
		// 	// value : this.obj[this.prop]
		// }
		
	}
 
 
	render(){
		if(this.item)
			return(<>
				{this.state.value}
			</>)	
	}
}

class PrefEditorInteger extends PrefEditor{
	constructor(props){
		super(props)
		this.state = {
			// value : this.obj[this.prop]
		}
		
	}
 
 
	render(){
		if(this.item)
			return(<>
				{this.state.value}
			</>)	
	}
}

export {
	PrefEditorBoolean,
	PrefEditorInteger,
	PrefEditorObject,
	PrefEditorString
}