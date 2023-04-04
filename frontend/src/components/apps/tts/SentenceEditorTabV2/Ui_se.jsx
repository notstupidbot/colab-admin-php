import Action_se from "./Action_se"
import TitleEditor from "./forms/TitleEditor"
import ContentEditor from "./forms/ContentEditor"
import ContentTtfEditor from "./forms/ContentTtfEditor"
import SentenceItemEditor from "./forms/SentenceItemEditor/SentenceItemEditor"
import TaskQueueToolbar from "./forms/SentenceItemEditor/TaskQueueToolbar"
import SelectSpeaker from "./forms/SelectSpeaker"
import React from "react"

/**
 * Ui_se represent the actual SentenceEditorTab Ui
 * @component
 * @example
 * const config = AppConfig.getInstance()
 * const sentenceId = 'cc5b1f2f88ff4626b72b1956121095ad'
 * <Ui_se config={config} pk={sentenceId}>
 * @augments Action_se
 * @augments State_se
 * */ 
class Ui_se extends Action_se {
	seiRef = null
	tqtRef = null
	constructor(props){
		super(props)
		this.seiRef = React.createRef(null)
		this.tqtRef = React.createRef(null)

		
	}
	/**
	 * return get current ref of SentenceEditorItem component instance 
	 * */
	getSeiRef(){
		return this.seiRef.current
	}
	/**
	 * return get current ref of TaskQueueToolbar component instance 
	 * */
	getTqtRef(){
		return this.tqtRef.current
	}
	render(){
		// console.log(this.state.unique_id)
		const fieldEditorProps = {
			pk : this.pk,
			config : this.config,
			store : this.store,
			parent : this,
			unique_id : this.state.unique_id
		
		}
		return (<div className="SentenceTabEditorUi">
			{
				this.state.row ? (<>
					<SelectSpeaker config={this.config}/>
					<TitleEditor parent={this} pk={this.pk} title={this.state.title}/> 
					<div className="relative">
						<TaskQueueToolbar ref={this.tqtRef} 
										  onExtractTask={e=>this.seiRef.current.onTaskExtract(e)}
										  onConvertTask={e=>this.seiRef.current.onTaskConvert(e)}
										  onSynthesizeTask={e=>this.seiRef.current.onTaskSynthesize(e)}/>
						
						<ContentEditor parent={this} pk={this.pk} content={this.state.content}/> 
					</div>
					<SentenceItemEditor {...fieldEditorProps} 
						sentences={this.state.sentences} 
						ref={this.seiRef}  
						tqtRef={this.tqtRef}/> 
					<ContentTtfEditor {...fieldEditorProps} contentTtf={this.state.content_ttf}/> 
				</>) : ""
			}
			
		</div>)
	}
}

export default Ui_se