import {useState, useEffect} from "react"
import SelectSpeaker from "./SelectSpeaker"
import FormMessages from "./FormMessages"
import FormItems from "./FormItems"
import "./deps/auto-grow-textarea.css"
import AppConfig from "../../../lib/AppConfig"
import Helper from "../../../lib/Helper"
import { Link, NavLink, useLoaderData } from 'react-router-dom';

import axios from "axios"
let lastItem = null
export async function loader({ params }) {
	let currDate = (new Date).getTime()
	if(typeof localStorage.loaderIsRunning == 'undefined'){
		localStorage.loaderIsRunning = currDate
	}
	const lastDate = parseInt(localStorage.loaderIsRunning);

 	const timeBetween = currDate - lastDate 
 	console.log(timeBetween,lastItem)
 	if(lastItem != null){
 		if(lastItem.id == params.pk){
	 		if(timeBetween < 15000){
				console.log(`skip`)
				localStorage.loaderIsRunning = currDate
				return { sentence: lastItem }
			}
		}
 	}
	

  const config = AppConfig.getInstance()	

  const res = await axios(`${config.getApiEndpoint()}/api/tts/sentence?id=${params.pk}`);
  const item = res.data;
  if (!item) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  lastItem = item	
  localStorage.loaderIsRunning = currDate

  return { sentence:item };
}
export default function SentenceEditorTab({ws, config, activeSentence, socketConnected, activeTab}){
	const {sentence} = useLoaderData()
	const [speakerId, setSpeakerId] = useState("wibowo")
	const [toastMessage, setToastMessage] = useState("")
	const [toastStatus, setToastStatus] = useState(true)
	const [showToast, setShowToast] = useState(false)

	/* Form Data Object*/
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [contentTtf, setContentTtf] = useState("")
	const [items, setItems] = useState("[]")
	const [projectId, setProjectId] = useState("[]")
	const [pk, setPk] = useState("")


	const hideToast = () => setShowToast(false)
	const onSave_clicked = () => {
		console.log(`SentenceEditorTab.onSave_clicked`)
	}
	const onInsertAllTttf_clicked = () => {
		console.log(`SentenceEditorTab.onInsertAllTttf_clicked`)
	}

	useEffect(()=>{
		if(sentence){
			console.log(sentence)

			setTitle(sentence.title)
			setProjectId(sentence.project_id)
			setContent(sentence.content)
			setContentTtf(sentence.content_ttf)
			setItems(sentence.sentences)
			setPk(sentence.id)
		}
	},[sentence])

	return(<>	
		<SelectSpeaker speakerId={speakerId} setSpeakerId={setSpeakerId}/>
		<FormMessages toastMessage={toastMessage}
					  toastStatus={toastStatus}
					  showToast={showToast}
					  hideToast={hideToast}
					  onSave_clicked={onSave_clicked}
					  onInsertAllTttf_clicked={onInsertAllTttf_clicked}/>
		<FormItems socketConnected={socketConnected} config={config}
				   title={title} setTitle={setTitle}
				   content={content} setContent={setContent}
				   contentTtf={contentTtf} setContentTtf={setContentTtf}
				   projectId={projectId} setProjectId={setProjectId}
				   items={items} setItems={setItems}
				   pk={pk}
				   speakerId={speakerId}/>							
	</>)
}