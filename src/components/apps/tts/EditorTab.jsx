import React ,{useEffect,useState,useRef}from "react";
import { useBetween } from "use-between";
import axios from "axios"

import useActiveTabState from "../shared/useActiveTabState";
import useActiveProjectState from "../shared/useActiveProjectState";
const useSharedActiveTabState = () => useBetween(useActiveTabState);
const useSharedActiveProjectState = () => useBetween(useActiveProjectState)

// import { useBetween } from "use-between";
import useSocketClient from "../../../shared/useSocketClient";
import useSocketState from "../../../shared/useSocketState";
// import useServerCfgState from "./shared/useServerCfgState";

// const useSharedServerCfgState = () => useBetween(useServerCfgState);
const useSharedSocketState = () => useBetween(useSocketState);
const useSharedSocketClient = () => useBetween(useSocketClient)

let dontRunTwice = true

export default function EditorTab(){
	const {activeProject,setActiveProject} = useSharedActiveProjectState();
	const {activeTab,setActiveTab} = useSharedActiveTabState();
	const {socketClient} = useSharedSocketClient();
	const {socketConnected} = useSharedSocketState();
	const textInputRef = useRef(null);
	const ttfTextInputRef = useRef(null);
	const [ttfText,setTtfText] = useState("")
	const textInputChangeHandler = ()=>{

	}

	const runHandler = ()=>{
		var bodyFormData = new FormData();
		bodyFormData.append('text', textInputRef.current.value);

		axios({
			method: "post",
			url: `http://localhost/api/tts/project`,
			data: bodyFormData,
			headers: { "Content-Type": "multipart/form-data" },
		})
		.then(function (response) {
			//handle success
			console.log(response);
			setTtfText(response.data.project.word_list_ttf_str)
		})
		.catch(function (response) {
			//handle error
			console.log(response);
		});
	}

	useEffect(()=>{
		setTimeout(()=>{
			textInputRef.current.focus()
			textInputRef.current.setSelectionRange(textInputRef.current.value.length, textInputRef.current.value.length)
		},1000)
	},[activeProject])

	useEffect(()=>{

	},[])
	return(<>
		<div className="container">
			<div>
				<textarea value={activeProject.text} ref={textInputRef} onChange={evt=>textInputChangeHandler()} className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" rows="3" placeholder="This is a textarea placeholder"></textarea>	
			</div>
			<div>
				<textarea value={ttfText} ref={ttfTextInputRef} onChange={evt=>textInputChangeHandler()} className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" rows="3" placeholder="This is a textarea placeholder"></textarea>	
			</div>
			<div className="columns-2 my-3">
				<div>
				<div className="bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-md p-4" role="alert">
{
	socketConnected? (
		<span className="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full bg-blue-600 text-white">
  <svg classname="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
  </svg>
</span>
	):(
<span className="inline-flex justify-center items-center w-[46px] h-[46px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
  </svg>
</span>
	)
}



  </div>
				</div>

				<div className="text-right">
					<button  onClick={evt=>runHandler()} class="py-3 px-4 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
  Run
  <svg class="w-2.5 h-auto" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z" fill="currentColor"/>
  </svg>
</button>
				</div>
			</div>
		</div>	
	</>)
}