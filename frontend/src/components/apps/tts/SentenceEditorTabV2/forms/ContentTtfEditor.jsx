import React from "react"
import Helper from "../../../../lib/Helper"
import TextareaAutosize from 'react-textarea-autosize';

export default class ContentTtfEditor extends React.Component {
	contentTtfInputRef = null
	parent = null
    constructor(props){
        super(props)
		this.parent = props.parent

		this.contentTtfInputRef = React.createRef(null)
	}


	async onChangeContentTtf(evt){
		Helper.delay(async(e)=>{
			const contentTtf = evt.target.value;

			if(!contentTtf){
				return;
			}

			await this.props.store.updateSentenceField('content_ttf', contentTtf, this.props.pk)
			this.parent.updateRow('content_ttf', contentTtf)
		})
	}
	loadFormData(){
		setTimeout(()=>{
			try {
				this.contentTtfInputRef.current.value = this.props.contentTtf
			} catch (error) {
				console.log(error)
				this.loadFormData()
			}
		},500)
	}
	componentDidMount(){
		this.loadFormData()
	}
	render(){
	    const cls = "my-3 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
        return(<>
            <div>
                <div className="grow-wrap">
                    <TextareaAutosize ref={this.contentTtfInputRef} 
                        maxRows={15}
                        onChange={ evt => this.onChangeContentTtf(evt)} 
                        className={cls}
                        defaultValue={this.props.contentTtf} 
                        placeholder="Content Ttf text">
                    </TextareaAutosize>	
                </div>
            </div>
        </>)
    }
}