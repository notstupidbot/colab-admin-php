import React from "react";
import SentenceItem from "./SentenceItem";
import Helper from "../../../../../lib/Helper"
const delay = Helper.makeDelay(250)
/**
 * Toolbar_ttf
 * @component
 * */
class Toolbar_ttf extends React.Component{
    audioRef = null
    parent = null
    constructor(props){
        super(props)
        this.parent = props.parent
        this.audioRef = React.createRef(null)
        this.state = {
            hideAudio : true,
            audioSource : '',
            loadingSynthesize : false
        }
    }
    /**
     * @example 
     * this.applyState({hideAudio,audioSource,loadingSynthesize})
     * */
    applyState(srcState){
        const {
            hideAudio,audioSource,loadingSynthesize
        } = srcState

        const appliedState = {
            hideAudio,audioSource,loadingSynthesize
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
     * onSynthesizeItem toolbar click
     * */
    onSynthesizeItem(evt, index){
        const text = evt.target.value;

			this.setState({loadingSynthesize:true})
            const sie = this.parent.parent
            const inTaskMode = sie.state.taskModeSynthesize

            if(inTaskMode){
                console.log(`TtfItem.onSynthesizeItem() canceled because taskModeSynthesize is true`)
                return
            }
            console.log(inTaskMode)
    }

    render(){
		const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"

	    const rcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
        const index = this.props.index
        return(<div className="absolute z-10 right-1">
        <div className="inline-flex shadow-sm">
          <button title="Synthesize this line" 
                    disabled={this.state.loadingSynthesize} type="button" 
                    onClick={evt=>this.onSynthesizeItem(evt,index)} 
                    className={rcls}>
            {
                this.state.loadingSynthesize ? (<span className={loadingCls} role="status" aria-label="loading">
                                            <span className="sr-only">Loading...</span>
                                          </span>)
                                     : (<i className="bi bi-soundwave"></i>)
            }
          </button>
          <div style={{display:this.state.hideAudio?'none':'block'}} className="audio-container w-7 h-8  overflow-hidden mt-1 py-1 px-1 gap-2 -ml-px  first:ml-0  border">
                <audio  controls ref={this.audioRef} 
                       onCanPlay={e=>this.onCanPlay(e)}
                       onCanPlayThrough={e=>this.onCanPlaytrough(e)}
                       onLoadedData={e=>this.onLoaded(e)}
                       style={{width:100,marginLeft:-17,marginTop:-16}}
                       className="bg-transparent">
                      <source src={this.state.audioSource} />
                </audio>
            </div>
            </div>
</div>)
    }
}
/**
 * TtfItem
 * @component
 * @augments SentenceItem
 * */
class TtfItem extends SentenceItem{

    constructor(props){
        super(props)
        this.setType('ttf', props)
        this.setToolbar(<Toolbar_ttf index={props.index} parent={this}/>)
    }    
}

export default TtfItem