import React from "react"
class Toolbar_sei extends React.Component{
    parent = null
	 constructor(props){
        super(props)
        this.parent = props.parent
        this.state = {
			inTaskMode : false
        }
    }
	getInputText(){
        return this.parent.getInputText()
    }
    getSie(){
        return this.parent.parent
    }
    getStore(){
        return this.getSie().getStore()
    }
    getPk(){
        return this.getSie().props.pk
    }
}

export default Toolbar_sei