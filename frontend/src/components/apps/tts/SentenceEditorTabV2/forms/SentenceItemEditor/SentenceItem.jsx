import React from "react";
import Helper from "../../../../../lib/Helper"
/**
 * SentenceItem
 * @component
 * */
class SentenceItem extends React.Component{
    inputRef = null
    parent = null
    type = null
    index = null
    content = null
    toolbar = ""
    constructor(props){
        super(props)
        this.inputRef = React.createRef(null)
        this.parent = props.parent
        this.index = props.index

        this.state = {
            inTaskMode : false,
            content : ''
        }
    }
    /**
     * @example 
     * this.setType('ttf',props)
     * this.setType('text',props)
     * */
    setType(type, props){
        this.content = props.item[type]
        this.type = type
    }
    onItemFocus(evt){

    }
    /**
     * @example 
     * this.applyState({inTaskMode, content})
     * */
    applyState(srcState){
        const {
            inTaskMode, content
        } = srcState

        const appliedState = {
            inTaskMode, content
        }
        Object.keys(this.state).map(key=>{
            if(typeof appliedState[key] != 'undefined' ){
                let state = {}
				state[key] = appliedState[key]
				this.setState(state)
            }
        })

    }
    /**
     * set content text
     * */
    setContent(content){
        this.content = content
        this.setState({content})
        this.inputRef.current.value = content

    }
   
   /**
     * componentDidUpdate
     * */
    componentDidUpdate(){
        this.applyToolbarState(this.state)
    }
    /**
     * onChangeContent
     * */
    onChangeContent(evt){
        console.log(evt)
        Helper.delay(()=>{
            const content = this.getInputText()
            // console.log(this.content)
            if(content === this.content){
                return
            }
            console.log(content)
            this.content = content
            this.setState({ content })
            this.parent.onItemChange(this)
        })
    }
    /**
     * applyToolbarState
     * */
    applyToolbarState(newState){
        if(this.toolbarRef){
            if(this.toolbarRef.current){
                this.toolbarRef.current.applyState(newState)
            }
        }
    }
    /**
     * getInputText
     * */
    getInputText(){
        return this.inputRef.current.value
    }
     
    /**
     * setToolbar
     * */
    setToolbar(toolbar){
        this.toolbar = toolbar
    }
    componentDidMount(){
        // console.log(this.inputRef)
        this.inputRef.current.value = this.props.item[this.type]
    }
    render(){
	    const cls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 focus:dark:bg-slate-800";

        const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"


        return(<>
        {this.toolbar}
        <textarea ref={this.inputRef} className={`${this.type=='dot'?'dot':'comma'} sentence-item-${this.type} sentence-item-${this.type}-${this.index} `+cls} 
        onChange={evt=>{this.onChangeContent(evt)} }
        
        >
            
        </textarea>
        </>)
    }
}


export default SentenceItem