import {useState, useEffect, useRef} from "react"
import SelectSpeaker from "./SelectSpeaker"
import FormMessages from "./FormMessages"
import FormItems from "./FormItems"
import "./deps/auto-grow-textarea.css"
import AppConfig from "../../../lib/AppConfig"
import Helper from "../../../lib/Helper"
import { Link, NavLink, useLoaderData } from 'react-router-dom';

import axios from "axios"
let lastSentenceId = null
export async function loader({ params }) {

  return { sentenceId:params.pk };
}
export default function SentenceEditorTab({socketConnected}){
	const {sentenceId} = useLoaderData()
	const [sentence,setSentence]= useState(null)
	// const [lastSentenceId,setLastSentenceId]= useState("")

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
	// const lastSentenceRef = useRef()
	// lastSentenceRef.current = lastSentenceId
	const getSentence = async() =>{

	  const config = AppConfig.getInstance()	

	  const res = await axios(`${config.getApiEndpoint()}/api/tts/sentence?id=${sentenceId}`);
	  setSentence( res.data);


	}
	const hideToast = () => setShowToast(false)
	const onSave_clicked = async() => {
		console.log(`SentenceEditorTab.onSave_clicked`)
		const formData = new FormData();
		let tmpItems = []; 
		if(typeof items === 'string'){
			try{
				tmpItems = JSON.parse(items);

			}catch(e){}
		}
		if(tmpItems.length==0){
			tmpItems = document.querySelectorAll('.sentence-item-ttf');
		}
		let frmItems = []
		for(let index in tmpItems){
			frmItems.push({text:'',ttf:''})
			const inputRefCurrent = document.querySelector(`.sentence-item-text-${index}`)
			const ttfRefCurrent = document.querySelector(`.sentence-item-ttf-${index}`)

			if(inputRefCurrent){
				frmItems[index].text = inputRefCurrent.value;
				frmItems[index].ttf = ttfRefCurrent.value;
			}
		}
		formData.append('sentences', JSON.stringify(frmItems));

		formData.append('title', title);
		formData.append('content', content);
		formData.append('content_ttf', contentTtf);

		// console.log(formData.entries());
		// return
		const res = await axios({
			method: "post",
			url: `${AppConfig.getInstance().getApiEndpoint()}/api/tts/sentence?id=${pk}`,
			data: formData,
			headers: { "Content-Type": "multipart/form-data" },
		});

		return res.data;
		console.log(items)
	}
	const onInsertAllTttf_clicked = () => {
		console.log(`SentenceEditorTab.onInsertAllTttf_clicked`);
		let tmpItems = []; 
		if(typeof items === 'string'){
			try{
				tmpItems = JSON.parse(items);

			}catch(e){}
		}
		let contentTtfTmp = '';
		console.log(tmpItems);

		if(tmpItems.length==0){
			tmpItems = document.querySelectorAll('.sentence-item-ttf');
		}
		for(let index in tmpItems){
			const ttfRefCurrent = document.querySelector(`.sentence-item-ttf-${index}`)
			console.log(ttfRefCurrent)
			if(ttfRefCurrent){
				const isComma = ttfRefCurrent.className.match(/comma/);
				let ttf = ttfRefCurrent.value.trim()

				if(ttf.length > 0){
					contentTtfTmp += ttf + (isComma? ",":".\n")
				}
			}
		}
		setContentTtf(contentTtfTmp)
		setTimeout(()=>{
			window.dispatchEvent(new Event('resize'));
		},500);
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

	useEffect(()=>{
		// getSentence()
		// console.log(lastSentenceId)
		// if(lastSentenceId != sentenceId){
		// 	lastSentenceId = sentenceId
		// 	console.log(`${lastSentenceId},${sentenceId}`)
			getSentence()
		// }
	},[sentenceId])

 

	return(<>	
		<SelectSpeaker speakerId={speakerId} setSpeakerId={setSpeakerId}/>
		<FormMessages toastMessage={toastMessage}
					  toastStatus={toastStatus}
					  showToast={showToast}
					  hideToast={hideToast}
					  onSave_clicked={onSave_clicked}
					  onInsertAllTttf_clicked={onInsertAllTttf_clicked}/>
		<FormItems socketConnected={socketConnected}
				   title={title} setTitle={setTitle}
				   content={content} setContent={setContent}
				   contentTtf={contentTtf} setContentTtf={setContentTtf}
				   projectId={projectId} setProjectId={setProjectId}
				   items={items} setItems={setItems}
				   pk={pk}
				   speakerId={speakerId}/>							
	</>)
}