import React from "react"
import Helper from "../../../../lib/Helper"
/**
 * UiItem
 * @component
 * */
class UiItem extends React.Component{
	inputRef = null
	parent = null
	fieldName = null
	constructor(props, fieldName){
		super(props)
		this.parent = props.parent
		this.fieldName = fieldName
		this.inputRef = React.createRef(null)

		this.state = {}
	}
	/**
	 * get Store object instance of the parent componen
	 * return {object} 
	 * */
	getStore(){
		return this.getParent().getStore()
	}
	/**
	 * get parent component instance
	 * return {Ui_se} 
	 * */
	getParent(){
		return this.parent
	}
	/**
	 * alias of getParent() : get parent component instance
	 * return {Ui_se} 
	 * */
	getUi(){
		return this.parent
	}
	/**
	 * get current sentence id
	 * return {string} 
	 * */
	getPk(){
		return this.props.pk
	}
	/**
	 * get current input value
	 * return {string} 
	 * */
	getInputValue(){
		return this.inputRef.current.value
	}
	/**
	 * set current input value
	 * */
	setInputValue(value){
		this.inputRef.current.value = value
	}

	/**
	 * on change input handler
	 * */
	async onChangeInput(evt){
		Helper.delay(async(e)=>{
			const inputValue = evt.target.value;

			if(!inputValue){
				return;
			}
			const fieldName = this.fieldName === 'contentTtf' ? 'content_ttf' : this.fieldName
			await this.getStore().updateSentenceField(fieldName, inputValue, this.getPk())
			this.getUi().updateRow(fieldName, inputValue)
			
		})
	}
	/**
	 * load current fieldName props and render to input node
	 * */
	loadFormData(){
		setTimeout(()=>{
			try {
				this.setInputValue(this.props[this.fieldName])
			} catch (error) {
				console.log(error)
				this.loadFormData()
			}
		},500)
	}
	/**
	 * componentDidMount() component handler
	 * execute loadFormData()
	 * */
	componentDidMount(){
		this.loadFormData()
	}
}


export default UiItem