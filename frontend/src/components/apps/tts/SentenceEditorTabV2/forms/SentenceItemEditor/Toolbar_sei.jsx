import React from "react"
/**
 * Toolbar_sei
 * */
class Toolbar_sei extends React.Component{
    parent = null
	 constructor(props){
        super(props)
        this.parent = props.parent
        this.state = {
			inTaskMode : false
        }
    }
    /**
     * get current SentenceItem input text
     * */
	getInputText(){
        return this.parent.getInputText()
    }
    /**
     * get SentenceItemEditor instance
     * */
    getSie(){
        return this.parent.parent
    }
    /**
     * get curent Store instance
     * */
    getStore(){
        return this.getSie().getStore()
    }
    /**
     * get curent sentence row pk
     * */
    getPk(){
        return this.getSie().props.pk
    }
}

export default Toolbar_sei