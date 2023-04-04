
import UiItem from "./UiItem"
/**
 * TitleEditor component form item 
 * @component
 * @example
 * <TitleEditor parent={Ui_se} pk={Ui_se.pk} content={Ui_se.state.title}/>
 * @augments UiItem
 * */
class TitleEditor extends UiItem {
	constructor(props){
		super(props, 'title')
	}
	
	render(){
		const cls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"

		return(<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
						<label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Title</label>
						<input onChange={evt=>this.onChangeInput(evt)} ref={this.inputRef} type="text" 
							   id="inline-input-label-with-helper-text" 
							   defaultValue={this.props.title}
						   className={cls} placeholder="Title" />
				</div>)
	}
}

export default TitleEditor