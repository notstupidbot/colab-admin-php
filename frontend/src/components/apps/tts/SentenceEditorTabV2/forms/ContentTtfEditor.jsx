import React from "react"
import Helper from "../../../../lib/Helper"
import TextareaAutosize from 'react-textarea-autosize';
import UiItem from "./UiItem"
/**
 * ContentTtfEditor
 * @component
 * @augments UiItem
 * @example
 * <ContentTtfEditor parent={Ui_se} pk={Ui_se.pk} content={Ui_se.state.title}/>
 * */
class ContentTtfEditor extends UiItem {
    constructor(props){
        super(props, 'contentTtf')
	}


	
	render(){
	    const cls = "my-3 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
        return(<>
            <div>
                <div className="grow-wrap">
                    <TextareaAutosize ref={this.inputRef} 
                        maxRows={15}
                        onChange={ evt => this.onChangeInput(evt)} 
                        className={cls}
                        defaultValue={this.props.contentTtf} 
                        placeholder="Content Ttf text">
                    </TextareaAutosize>	
                </div>
            </div>
        </>)
    }
}

export default ContentTtfEditor 