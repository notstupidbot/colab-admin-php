import React from "react";
import SentenceItem from "./SentenceItem";
import Helper from "../../../../../lib/Helper"
const delay = Helper.makeDelay(250)
class Toolbar extends React.Component{
    parent = null
    constructor(props){
        super(props)
        this.parent = props.parent
        this.state = {
            loadingConvert : false
        }
    }
    onConvertItem(evt, index){

			const text = evt.target.value;
			this.setState({loadingConvert:true})
			const sie = this.parent.parent
			const inTaskMode = sie.state.taskModeConvert
            console.log(inTaskMode)
			/*sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs);
			sentenceItemRefs_tmp[index].loading = true;
			setSentenceItemRefs(sentenceItemRefs_tmp);

			const res = await axios(`${config.getApiEndpoint()}/api/tts/convert?text=${encodeURI(text)}`);
			let ttf = ''; 
			for(let k in res.data){
				ttf += res.data[k].ttf + ' '
			}

			const ttfRefCurrent = document.querySelector(`.sentence-item-ttf-${index}`)
			ttfRefCurrent.value = ttf.trim()
			sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs);
			sentenceItemRefs_tmp[index].loading = false;
			setSentenceItemRefs(sentenceItemRefs_tmp);
			
            */
		
	}
    
    render(){
		const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"

	    const lcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
        const index = this.props.index
        return(<>
        <div className="absolute z-10 right-2">
				<div className="inline-flex shadow-sm">
				  <button title="Translate this line" 
				  		  disabled={this.state.loadingConvert} 
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
export default class TextItem extends SentenceItem{

    constructor(props){
        super(props)
        this.setType('text', props)
        this.setToolbar(<Toolbar index={props.index} parent={this}/>)

    }
    
    
    
}