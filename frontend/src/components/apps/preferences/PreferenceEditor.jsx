import React, {useState} from "react"

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
	}

	saveRow(){
		this.setState({editMode:false})

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
 
 
	render(){
		if(this.item){
			return(<>
			{
				this.state.editMode ? (<>
					<input className={inputCls} type="text" defaultValue={this.state.value}/>
				</>): (<>
					{this.state.value} : 
					{this.state.length}
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