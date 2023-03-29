import React from "react";
import Helper from "../../../../../lib/Helper"

export default class SentenceItem extends React.Component{
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
    }
    setType(type, props){
        this.content = props.item[type]
        this.type = type
    }
    onItemFocus(evt){

    }

    onChangeContent(evt){
        Helper.delay(()=>{
            const content = this.getInputText()
            // console.log(this.content)
            if(content === this.content){
                return
            }
            console.log(content)
            this.content = content

            this.parent.onItemChange(this)
        })
    }

    getInputText(){
        return this.inputRef.current.textContent
    }
    onItemClick(evt){
        // $(this.inputRef.current).prop('contentEditable',true)
    }
    onItemBlur(evt){
        // $(this.inputRef.current).prop('contentEditable',false)
        // this.onChangeContent(evt)
    }
    setToolbar(toolbar){
        this.toolbar = toolbar
    }
    render(){
	    const cls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 focus:dark:bg-slate-800";

        const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"


        return(<>
        {this.toolbar}
        <textarea ref={this.inputRef} className={`${this.type=='dot'?'dot':'comma'} sentence-item-${this.type} sentence-item-${this.type}-${this.index} `+cls} 
        onChange={evt=>{this.onChangeContent(evt)} }
        defaultValue={this.props.item[this.type]}
        >
            
        </textarea>
        </>)
    }
}