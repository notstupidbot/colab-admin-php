import {createRef, useState, useEffect} from "react"

import Helper from "../../../app/Helper"
const delay = Helper.makeDelay(500)

export default function TitleEditor({title, setTitle}){
	const titleInputRef = createRef(null)
	const cls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
	const onChangeTitle = evt => {
		const title = evt.target.value;
		if(!title){
			return;
		}
		delay(async(e)=>{
			setTitle(title)
		  // this.model.setTitle(title);
		  // await this.model.updateRow();
		})
	}

	useEffect(()=>{
		titleInputRef.current.value = title
	},[title])
	return(<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
		<label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Title</label>
		<input onChange={evt=>onChangeTitle(evt)} ref={titleInputRef} type="text" 
			   id="inline-input-label-with-helper-text" 
			   className={cls} placeholder="Title" 
			   aria-describedby="hs-inline-input-helper-text"/>
		<p className="text-sm text-gray-500 mt-2" id="hs-inline-input-helper-text">{/*We'll never share your details.*/}</p>
	</div>)
}