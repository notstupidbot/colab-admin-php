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
	}

	render(){
		const fieldEditorProps = {
			pk : this.pk,
			config : this.config,
			store : this.store,
			parent : this
		}
		return (<div className="SentenceTabEditorUi">
			{
				this.state.row ? (<>
					<SelectSpeaker {...fieldEditorProps}/>
					<TitleEditor {...fieldEditorProps} title={this.row.title}/> 
					<div className="relative">
						<TaskQueueToolbar {...fieldEditorProps} parent={this.seiRef} ref={this.tqtRef}/>
						<ContentEditor {...fieldEditorProps} content={this.row.content}/> 
					</div>
					<SentenceItemEditor {...fieldEditorProps} sentences={this.row.sentences} ref={this.seiRef}  tqtRef={this.tqtRef}/> 
					<ContentTtfEditor {...fieldEditorProps} contentTtf={this.row.content_ttf}/> 
				</>) : ""
			}
			
		</div>)
	}
}