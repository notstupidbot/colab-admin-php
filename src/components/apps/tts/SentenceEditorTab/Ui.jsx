import {useState, useEffect, useRef, createRef} from "react"
import SelectSpeaker from "./SelectSpeaker"
import FormMessages from "./FormMessages"
import FormItems from "./FormItems"
import "./deps/auto-grow-textarea.css"
import AppConfig from "../../../lib/AppConfig"
import Helper from "../../../lib/Helper"
import { Link, NavLink, useLoaderData } from 'react-router-dom';

import axios from "axios"
import {v4} from "uuid"
let lastSentenceId = null
export async function loader({ params }) {

  return { sentenceId:params.pk };
}
export default function SentenceEditorTab({socketConnected, ws, config}){
	const {sentenceId} = useLoaderData()
	const [sentence,setSentence]= useState(null)
	// const [lastSentenceId,setLastSentenceId]= useState("")

	const [speakerId, setSpeakerId] = useState("wibowo")
	const [toastMessage, setToastMessage] = useState("")
	const [toastStatus, setToastStatus] = useState(true)
	const [showToast, setShowToast] = useState(false)
	const [audioOutput, setAudioOutput] = useState("")

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
				frmItems[index].type = ttfRefCurrent.className.match(/comma/) ?'comma':'dot';
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
		
	// useEffect(()=>{
	// 	// console.log(sentenceItemRefs)
	// },[sentenceItemRefs])
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
		console.log(jobChecker)
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
	const onSocketLog = (message, data, ws_) => {
		if(typeof data.job == 'object'){
			jobCheckerRemove(data.job);

			if(data.job.name == 'tts'){
				let success = data.success;
				success == true ? true : (success == -1 ? false : (success== 1? true : false))
				const chunkMode = data.chunkMode;

				try{
					message += ` done in ${data.elapsed_time} seconds`
				}catch(e){

				}

				doToast(message, success)

				if(data.at == 'run_process'){
					/* chunkMode */

					if(chunkMode){
						const index = data.index;

						const ausource = `${config.getApiEndpoint()}/public/tts-output/${data.sentence_id}-${index}.wav?uuid=${v4()}`;
							
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
					} /* end of if chunkMode */
				} /* end of data.at == run_process */
			} /* end of job.name == tts */
		} /*end of typeof data == object */
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
				   audioOutput={audioOutput} setAudioOutput={setAudioOutput}/>							
	</>)
}