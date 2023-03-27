import {useState, useEffect, useRef} from "react"
import { Link, NavLink, useLoaderData } from 'react-router-dom';

import axios from "axios"
import {v4} from "uuid"
import Prx from "../../../lib/Prx"
import Ws from "../../../lib/Ws"
import FormMessages from "./FormMessages"
import FormItems from "./FormItems"
import Helper from "../../../lib/Helper"
import SelectSpeaker from "./SelectSpeaker"

import "./deps/sentence-editor-tab.css"
import "./deps/auto-grow-textarea.css"

const ws = Ws.getInstance();

export async function loader({ params }) {
  return { sentenceId:params.pk };
}

export default function SentenceEditorTab({config}){
  const [socketConnected,setSocketConnected] = useState(false);
  

	const {sentenceId} = useLoaderData()
	const [sentence,setSentence]= useState(null)

	const [speakerId, setSpeakerId] = useState("wibowo")
	const [toastMessage, setToastMessage] = useState("")
	const [toastStatus, setToastStatus] = useState(true)
	const [showToast, setShowToast] = useState(false)
	const [audioOutput, setAudioOutput] = useState("")
	const [lastFormData, setLastFormData] = useState("base64FormData")
	const lastFormDataRef = useRef(null)
	lastFormDataRef.current = lastFormData
	// const [prevRowSum, setPrevRowSum] = useState("")

	/* Form Data Object*/
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [contentTtf, setContentTtf] = useState("")
	const [items, setItems] = useState("[]")
	const [projectId, setProjectId] = useState("[]")
	const [pk, setPk] = useState("")
	const [sentenceItemRefs, setSentenceItemRefs] = useState([])
	const [sentenceItemTaskRefs, setSentenceItemTaskRefs] = useState({
		queuSynthesizeTask:false,
		currentQueueSynthesizeIndex : 0,
		running : false,
		nextIndex : 0,
		status : 0
	})
	const sentenceItemRefs_ = useRef(null)
	const sentenceItemTaskRefs_ = useRef(null)
	sentenceItemRefs_.current = sentenceItemRefs;
	sentenceItemTaskRefs_.current = sentenceItemTaskRefs;
	const jobCheckerRef = useRef(null)
	const pkRef = useRef(null)
	const titleRef = useRef(null)
	const contentRef = useRef(null)
	const contentTtfRef = useRef(null)
	pkRef.current = pk
	titleRef.current = title
	contentRef.current = content
	contentTtfRef.current = contentTtf


	

	const getSentence = async() =>{

	  const res = await Prx.get(`${config.getApiEndpoint()}/api/tts/sentence?id=${sentenceId}`);
	  if(res)
	  	setSentence( res.data);


	}
	const isDirtyRow = (newFormData) =>{
		const newFormDataStr = formData64(newFormData)
		console.log(newFormDataStr != lastFormDataRef.current)
		return newFormDataStr != lastFormDataRef.current
	}
	const formData64 = (formData) =>{
		let buffer = ''
		formData.forEach((val,prop)=>{
			buffer+=`${prop}${encodeURI(val)}`
		})
		return btoa(buffer)
	}
	const hideToast = () => setShowToast(false)
	const onSave_clicked = async() => {
		console.log(`SentenceEditorTab.onSave_clicked`)
		
		const checkUrlRegex = new RegExp(`tts\/sentence-editor\/${pkRef.current}`)
		if(!document.location.hash.match(checkUrlRegex)){
			console.log(`cancel saving because invalid routes`)
			return
		}

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
				frmItems[index].type = ttfRefCurrent.className.match(/comma/) ?'comma':'dot';
			}
		}
		if(frmItems.length > 0)
			formData.append('sentences', JSON.stringify(frmItems));

		formData.append('title', titleRef.current);
		formData.append('content', contentRef.current);
		formData.append('content_ttf', contentTtfRef.current);

		if(!isDirtyRow(formData) ){
			console.log(`formData is fresh canceling saveRecord`)
			return
		}
		
		setLastFormData(formData64(formData))
		// console.log(formData.entries());
		// return
		const res = await axios({
			method: "post",
			url: `${config.getApiEndpoint()}/api/tts/sentence?id=${pkRef.current}`,
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
			// console.log(ttfRefCurrent)
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
		document.title = "TTS Sentence Edit "+sentence.title

			// console.log(sentence)

			setTitle(sentence.title)
			setProjectId(sentence.project_id)
			setContent(sentence.content)
			setContentTtf(sentence.content_ttf)
			setItems(sentence.sentences)
			setPk(sentence.id)

			$('#sentence-editor-tab').removeClass('hidden')

		}
	},[sentence])


	useEffect(()=>{
		getSentence()
		ws.setSocketLogHandlerState(onSocketLog, {sentenceItemRefs})
	},[sentenceId])
	
	ws.setEndpoint(config.getMessagingEndpoint());
	ws.setSocketConnectedHandlerState(setSocketConnected);	
	
	useEffect(()=>{
		if(!ws.alreadyInit()){
			
			ws.init()
		}
		if(!socketConnected){
			setSocketConnected(ws.connection._websocket_connected)
		}
		// console.log()
	},[socketConnected])

	const jobCheckerRemove = (job) => {
		const jobChecker = jobCheckerRef.current;
		console.log(jobChecker)

		const jobList = jobChecker.state.jobList;
		const job_id = job.id;
		delete jobList[job_id];
		jobChecker.setState({jobList});
	}
	const jobCheckerAdd = (job) => {
		const jobChecker = jobCheckerRef.current;
		// console.log(jobChecker)
		const jobList = jobChecker.state.jobList;
		const job_id = job.id;
		jobList[job_id] = job;
		jobChecker.setState({jobList});
	}
	
	const doToast = (message, status) => {
		setToastMessage(message)
		setToastStatus(status)
		setShowToast(true)
	}
	const jobCheckerAdded = job =>{
		const jobChecker = jobCheckerRef.current;
		const jobList = jobChecker.state.jobList;
		const job_id = job.id;

		return typeof jobList[job_id] === 'object'
	}
	const onJobCreate = (message, job, data) =>{
		doToast(message, true)
		if(!jobCheckerAdded(job)){
			jobCheckerAdd(job);
		}
	}

	const onJobInit = (message, job, data) =>{
		doToast(message, true)
		if(!jobCheckerAdded(job)){
			jobCheckerAdd(job);
		}
	}

	const onJobSuccess = (message, job, data) => {
		message += ` done in ${data.elapsed_time} seconds`
		doToast(message, true)
		if(jobCheckerAdded(job)){
			jobCheckerRemove(job);
		}
		const chunkMode = data.chunkMode
		const index = data.index

		if(chunkMode){
			const index = data.index;
			const ausourceFilename = `${data.sentence_id}-${index}.wav`;
			const ausource = `${config.getApiEndpoint()}/public/tts-output/${ausourceFilename}?uuid=${v4()}`;
				
			/*****************************************/
			let sentenceItemRefs_tmp;
			sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs_.current);
			sentenceItemRefs_tmp[index].loadingTtf = false;
			setSentenceItemRefs(sentenceItemRefs_tmp);
			/******************** Task Item related **************************/
			const taskCfg = sentenceItemTaskRefs_.current
			console.log(taskCfg);
			if(taskCfg.queuSynthesizeTask){
				console.log(`task is running`);
				const newTaskCfg = Object.assign({}, taskCfg);

				newTaskCfg.currentQueueSynthesizeIndex = parseInt(index)
				newTaskCfg.status = 2
				newTaskCfg.nextIndex = parseInt(index) + 1
				newTaskCfg.job = data.job
				
				setSentenceItemTaskRefs(newTaskCfg)
			}

			/*****************************************************************/	
			// Prx.get(`${config.getApiEndpoint()}/api/tts/auexist?filename=${ausourceFilename}`).then(r=>{
			// 	console.log(r)
			// })
			console.log(ausource)
			const audioRefCurrent = $(`.sentence-item-ttf-${index}`).parent().prev().find('audio:first').get(0)
			const audioSrcCurrent = $(audioRefCurrent).find('source:first').get(0)
			audioSrcCurrent.src = ausource;

			if(audioRefCurrent){
				audioRefCurrent.load()
				audioRefCurrent.play()
			}
		/* NOT chunkMode */
		}else{
			const ausource = `${config.getApiEndpoint()}/public/tts-output/${data.sentence_id}.wav?uuid=${v4()}`;
			console.log(ausource)
			setAudioOutput(ausource)
		}
	}

	const onJobFail = (message, job, data) =>{
		// for(let i in data.errors){
		// 	if(data.errors[i] == 'curl_error_code_0'){
		// 		data.errors[i] = `could not get to ${config.getTtsEndpoint()}`
		// 	}
		// }
		message += ` ${data.errors.join(', ')}`;
		doToast(message, false)

		if(jobCheckerAdded(job)){
			jobCheckerRemove(job);
		}

		const chunkMode = data.chunkMode
		const index = data.index

		if(chunkMode){
			let sentenceItemRefs_tmp;
			sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs_.current);
			sentenceItemRefs_tmp[index].loadingTtf = false;
			setSentenceItemRefs(sentenceItemRefs_tmp);

			/******************** Task Item related **************************/
			const taskCfg = sentenceItemTaskRefs_.current
			console.log(taskCfg);
			if(taskCfg.queuSynthesizeTask){
				console.log(`task is running`);
				const newTaskCfg = Object.assign({}, taskCfg);

				newTaskCfg.currentQueueSynthesizeIndex = -1
				newTaskCfg.status = 0
				newTaskCfg.nextIndex = -1
				newTaskCfg.job = null
				newTaskCfg.queuSynthesizeTask = false
				newTaskCfg.running = false
				setSentenceItemTaskRefs(newTaskCfg)
			}

			/*****************************************************************/	
		}
	}

	const onSocketLog = (message, data, ws_) => {
		// console.log(message)
		// console.log(data)

		if(typeof data.job !== 'object'){
			console.log(`Ws skip data.job is not object`)
			return
		}

		if(data.job.name !== 'tts'){
			console.log(`Ws skip data.job.name is not tts`)
			return
		}

		const success = data.success
		const at = data.at
		const job = data.job
		switch(at){
			case 'init_process':
				return onJobInit(message, job, data)
			break;

			case 'run_process':
				if(success){
					return onJobSuccess(message, job, data)
				}else{
					return onJobFail(message, job, data)
				}
			break; 
		}

	}
	//useEffect(()=>{
		// console.log(sentenceItemTaskRefs)
	// },[sentenceItemTaskRefs])
	return(<>	
		<SelectSpeaker speakerId={speakerId} setSpeakerId={setSpeakerId}/>
		<FormMessages toastMessage={toastMessage}
					  toastStatus={toastStatus}
					  showToast={showToast}
					  hideToast={hideToast}
					  onSave_clicked={onSave_clicked}
					  onInsertAllTttf_clicked={onInsertAllTttf_clicked}
					  jobCheckerRef={jobCheckerRef}/>
		<FormItems socketConnected={socketConnected}
				   title={title} setTitle={setTitle}
				   content={content} setContent={setContent}
				   contentTtf={contentTtf} setContentTtf={setContentTtf}
				   projectId={projectId} setProjectId={setProjectId}
				   items={items} setItems={setItems}
				   pk={pk}
				   config={config} ws={ws}
				   speakerId={speakerId}
				   hideToast={hideToast}
				   doToast={doToast}
				   jobCheckerAdd={jobCheckerAdd}
				   sentenceItemRefs={sentenceItemRefs} 
				   setSentenceItemRefs={setSentenceItemRefs}
				   sentenceItemTaskRefs={sentenceItemTaskRefs} 
				   setSentenceItemTaskRefs={setSentenceItemTaskRefs}
				   audioOutput={audioOutput} setAudioOutput={setAudioOutput}
				   saveRecord={onSave_clicked}/>							
	</>)
}