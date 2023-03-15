import {createRef, useState, useEffect} from "react"
import axios from "axios"
import Helper from "../../../lib/Helper"
import AppConfig from "../../../lib/AppConfig"
const delay = Helper.makeDelay(500)

export default function TitleEditor({title, setTitle, pk}){
	const titleInputRef = createRef(null)
	const cls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
	

	const saveRecord = async()=>{
		const data = new FormData();
		data.append('title', title)
		const res = await axios({
			method: "post",
			url: `${AppConfig.getInstance().getApiEndpoint()}/api/tts/sentence?id=${pk}`,
			data: data,
			headers: { "Content-Type": "multipart/form-data" },
		});

		return res.data;
	}
	const onChangeTitle = evt => {
		const title = evt.target.value;
		if(!title){
			return;
		}
		Helper.delay(async(e)=>{
			console.log(title)
			setTitle(title)

			await saveRecord()
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