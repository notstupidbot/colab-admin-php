import React from "react";
import SentenceItem from "./SentenceItem"
import Toolbar_sei from "./Toolbar_sei"

import Helper from "../../../../../lib/Helper"
const delay = Helper.makeDelay(250)
/**
 * Toolbar_ti
 * @component
 * @augments Toolbar_sei
 * */
class Toolbar_ti extends Toolbar_sei{
    constructor(props){
        super(props)
        this.state.loadingConvert = false
    }
    /**
     * @example 
     * this.applyState({loadingConvert,inTaskMode})
     * */
	applyState(srcState){
        const {
            loadingConvert,inTaskMode
        } = srcState

        const appliedState = {
            loadingConvert,inTaskMode
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
     * onConvertItem toolbar click
     * */

    
    async onConvertItem(evt, index){
			const sie = this.getSie()
			const inTaskMode = sie.state.taskModeConvert
			if(inTaskMode){
                console.log(`TextItem.onConvertItem() canceled because taskModeConvert is true`)
                return
            }

			this.setState({loadingConvert:true})
			const inputText = this.getInputText()
			const ttf = await this.getStore().convertTtf(inputText) 

            const refTtf = sie.ttfItemRefs[index]
            refTtf.current.setContent(ttf)

            sie.items[index].ttf = ttf
			const sentences = sie.getItems(true)
        	this.getStore().updateSentenceField('sentences', sentences, this.getPk())
		
			this.setState({loadingConvert:false})
		
	}
    
    render(){
		const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"

	    const lcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
        const index = this.props.index
        return(<>
        <div className="absolute z-10 right-2">
				<div className="inline-flex shadow-sm">
				  <button title="Translate this line" 
				  		  disabled={this.state.loadingConvert || this.state.inTaskMode} 
				  		  type="button" 
				  		  onClick = { evt => this.onConvertItem(evt, index) } 
				  		  className={lcls}>
				    {
				    	this.state.loadingConvert ? (<span className={loadingCls} role="status" aria-label="loading">
										    	<span className="sr-only">Loading...</span>
										  	</span>)
				    					 : (<i className="bi bi-translate"></i>)
				    }
				  </button>
				</div>
		</div>
        </>)
    }
}
/**
 * TaskQueueToolbar
 * @component
 * */
class TextItem extends SentenceItem{
    constructor(props){
        super(props)
        this.setType('text', props)
        this.setToolbar(<Toolbar_ti index={props.index} parent={this} ref={this.toolbarRef}/>)

    }
}


export default TextItem