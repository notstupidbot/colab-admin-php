import React from "react";
import Helper from "../../../../../lib/Helper"

export default class SentenceItem extends React.Component{
    inputRef = null
    parent = null
    type = null
    index = null
    content = null
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
        $(this.inputRef.current).prop('contentEditable',true)
    }
    onItemBlur(evt){
        $(this.inputRef.current).prop('contentEditable',false)
        this.onChangeContent(evt)
    }
    render(){
        return(<><div ref={this.inputRef} className="select-none w-1/2 p-2 focus:font-bold focus:dark:text-black focus:dark:bg-white" onPaste={evt=>{this.onChangeTtf(evt)} }  
        onKeyUp={evt=>{this.onChangeContent(evt)} } 
            onClickCapture={(evt)=>this.onItemClick(evt)}  
            onFocus={evt=>{this.onItemFocus(evt)} } 
            onBlur={evt=>{this.onItemBlur(evt)} } 
        >
            {this.props.item[this.type]}
        </div>
        </>)
    }
}