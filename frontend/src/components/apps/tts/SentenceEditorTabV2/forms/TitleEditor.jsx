import React from "react"
import Helper from "../../../../lib/Helper"

export default class TitleEditor extends React.Component {
	titleInputRef = null
	parent = null
    constructor(props){
        super(props)
		this.parent = props.parent

		this.titleInputRef = React.createRef(null)
	}


	async onChangeTitle(evt){
		Helper.delay(async(e)=>{
			const title = evt.target.value;

			if(!title){
				return;
			}

			await this.props.store.updateSentenceField('title', title, this.props.pk)
			this.parent.updateRow('title', title)
			
		})
	}
	
	loadFormData(){
		setTimeout(()=>{
			try {
				this.titleInputRef.current.value = this.props.title


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
		const cls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"

		return(<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
						<label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Title</label>
						<input onChange={evt=>this.onChangeTitle(evt)} ref={this.titleInputRef} type="text" 
							   id="inline-input-label-with-helper-text" 
							   defaultValue={this.props.title}
						   className={cls} placeholder="Title" />
				</div>)
	}
}