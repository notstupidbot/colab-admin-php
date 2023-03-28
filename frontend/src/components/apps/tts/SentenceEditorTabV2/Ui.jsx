import Action from "./Action"
import TitleEditor from "./forms/TitleEditor"
import ContentEditor from "./forms/ContentEditor"
import ContentTtfEditor from "./forms/ContentTtfEditor"
import SentenceItemEditor from "./forms/SentenceItemEditor/SentenceItemEditor"
import SelectSpeaker from "./forms/SelectSpeaker"

export default class Ui extends Action {
	constructor(props){
		super(props)
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
					<ContentEditor {...fieldEditorProps} content={this.row.content}/> 
					<SentenceItemEditor {...fieldEditorProps} sentences={this.row.sentences}/> 
					<ContentTtfEditor {...fieldEditorProps} contentTtf={this.row.content_ttf}/> 
				</>) : ""
			}
			
		</div>)
	}
}