import Action from "./Action"
import TitleEditor from "./forms/TitleEditor"
import ContentEditor from "./forms/ContentEditor"
import ContentTtfEditor from "./forms/ContentTtfEditor"
import SentenceItemEditor from "./forms/SentenceItemEditor/SentenceItemEditor"
import TaskQueueToolbar from "./forms/SentenceItemEditor/TaskQueueToolbar"
import SelectSpeaker from "./forms/SelectSpeaker"
import React from "react"

export default class Ui extends Action {
	seiRef = null
	tqtRef = null
	constructor(props){
		super(props)
		this.seiRef = React.createRef(null)
		this.tqtRef = React.createRef(null)

		this.state = {
			// seiRefLoaded : false
		}
	}
	
	componentWillUnmount(){
		
	}
	render(){
		console.log(this.state.unique_id)
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
					<SelectSpeaker {...fieldEditorProps}/>
					<TitleEditor {...fieldEditorProps} title={this.state.title}/> 
					<div className="relative">
						<TaskQueueToolbar {...fieldEditorProps} 
								ref={this.tqtRef} 
								onExtractTask={e=>this.seiRef.current.onTaskExtract(e)}
								onConvertTask={e=>this.seiRef.current.onTaskConvert(e)}
								onSynthesizeTask={e=>this.seiRef.current.onTaskSynthesize(e)}/>
						
						<ContentEditor {...fieldEditorProps} content={this.state.content}/> 
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