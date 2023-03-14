import {createRef, useEffect} from "react"
import TextareaAutosize from 'react-textarea-autosize';
import {
	inputDefaultCls,
	inputOkCls,
	inputErrorCls
} from "./deps/inputCls"
import Helper from "../../../lib/Helper"

export default function ContentTtfEditor({contentTtf, setContentTtf}){
	const contentTtfInputRef = createRef(null)
	const cls = "my-3 py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
	const onChangeContentTtf = evt => {
		console.log(evt.target.value)

		const contentTtf = evt.target.value;
		Helper.delay(async(e)=>{
			setContentTtf(contentTtf)
		  // this.model.setContentTtf(contentTtf);
		  // await this.model.updateRow();
		})
	}

	useEffect(()=>{
		contentTtfInputRef.current.value = contentTtf.trim()
	},[contentTtf])
	return(<>
		<div>
			<div className="grow-wrap">
				<TextareaAutosize ref={contentTtfInputRef} 
				maxRows={15}
						  onChange={ evt => onChangeContentTtf(evt)} 
						  className={cls} 
						  placeholder="Content Ttf text">
				</TextareaAutosize>	
			</div>
		</div>
	</>)
}