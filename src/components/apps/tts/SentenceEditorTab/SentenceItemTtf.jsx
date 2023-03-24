import {createRef, useState, useEffect} from "react"

import {
	inputDefaultCls,
	inputOkCls,
	inputErrorCls
} from "./deps/inputCls"
import axios from "axios"
import Helper from "../../../lib/Helper"
import Prx from "../../../lib/Prx"
import AppConfig from "../../../lib/AppConfig"
import {v4} from "uuid"

export default function SentenceItemTtf({onResizeItemArea,index,item,config,ws, items,
	setSentenceItems, pk, speakerId, doToast,jobCheckerAdd,sentenceItemRefs, setSentenceItemRefs}){
	const ocls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";
	const lcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
	const rcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"


	const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
	const [loading, setLoading] = useState(false)
	let cls = ocls;		
	cls += item.type == 'dot' ? " " : " bg-gray-100"
	const [audioSource,setAudioSource] = useState("")
	const [onConvert,setOnConvert] = useState(false)
	const [hideAudio,setHideAudio] = useState(true)
	const inputRef = createRef(null)
	const audioRef = createRef(null)

	const onChangeTtfItem = (evt, index) => {
		const ttf = evt.target.value;
		console.log(ttf)
		/*delay(async()=>{
			await this.model.getSentences().updateItemTtf(ttf, index);
		});
		*/
	}


	const onSynthesizeItem = async (evt, index) => {
		// setLoading(true)
		let sentenceItemRefs_tmp;
		sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs);
		sentenceItemRefs_tmp[index].loadingTtf = true;
		setSentenceItemRefs(sentenceItemRefs_tmp);

		const text = inputRef.current.value
		
		const subscriber_id = ws.getSubcriberId();

		
		const speaker_id = speakerId;
		let url = `${config.getApiEndpoint()}/api/tts/job?subscriber_id=${subscriber_id}&job_name=tts&speaker_id=${speaker_id}`;

		let chunkMode = true;

		if(chunkMode){
			url += `&chunkMode=true&index=${index}`	
		}
			
		const params = new URLSearchParams({ });
		params.append('sentence_id', pk);
		params.append('text',encodeURI(text));

		const res = await axios.post(url, params);
		// setLoading(false)

		const data = res.data;
		const job = data.job;
		const success = data.success;
		/*
		if(success){
			jobCheckerAdd(job)
			doToast(`job created with id ${job.id}`, success)
		}else{
			doToast(`job created failed`, false)
		}
		*/
		console.log(res)

	}
	const loadFormData = ()=>{
		try{
			inputRef.current.value = item.ttf
		}catch(e){

		}
	}

	useEffect(()=>{
		// setHideAudio(true)
		const asourceFilename = `${pk}-${index}.wav`
		const asource = `${config.getApiEndpoint()}/public/tts-output/${asourceFilename}?uuid=${v4()}`;

		// Prx.get(`${config.getApiEndpoint()}/api/tts/auexist?filename=${asourceFilename}`).then(r=>{
		// 	try{
		// 		if(r.data.exist){
					setAudioSource(asource)
		// 		}
		// 	}catch(e){}
		// })

		// console.log(asource)
		loadFormData()
		// console.log(item)

	},[items])

	useEffect(()=>{
		setHideAudio(true)

		try{
			// console.log(item.audio_source);
			audioRef.current.load()
		}catch(e){

		}
	},[audioSource])
	
	const onCanPlay = evt => {
		setHideAudio(false)
	}
	const onCanPlaytrough = evt => {}
	const onLoaded = evt => {}
	const isLoading = (index)=>{
		if (typeof sentenceItemRefs[index] == 'object'){
			return sentenceItemRefs[index].loadingTtf
		}
		return false
	}
	return(<div className={"sentence-ttf relative"}>
				<div className="absolute z-10 right-1">
						<div className="inline-flex shadow-sm">
						  <button title="Synthesize this line" 
						  		  disabled={isLoading(index)} type="button" 
						  		  onClick={evt=>onSynthesizeItem(evt,index)} 
						  		  className={rcls}>
						    {
						    	isLoading(index) ? (<span className={loadingCls} role="status" aria-label="loading">
													    	<span className="sr-only">Loading...</span>
													  	</span>)
						    						 : (<i className="bi bi-soundwave"></i>)
						    }
						  </button>
						  <div style={{display:hideAudio?'none':'block'}} className="audio-container w-7 h-8  overflow-hidden mt-1 py-1 px-1 gap-2 -ml-px  first:ml-0  border">
								<audio  controls ref={audioRef} 
									   onCanPlay={e=>onCanPlay(e)}
								       onCanPlayThrough={e=>onCanPlaytrough(e)}
								       onLoadedData={e=>onLoaded(e)}
									   style={{width:100,marginLeft:-17,marginTop:-16}}
									   className="bg-transparent">
				          			<source src={audioSource} />
				        		</audio>
							</div>
							</div>
				</div>
				<div className="grow-wrap">
				<textarea  ref={inputRef} style={{minHeight:40}}
						   onMouseUp={evt => onResizeItemArea(evt)}
						   onMouseLeave={evt => onResizeItemArea(evt)}
						   onMouseDown={evt => onResizeItemArea(evt)}
						   onChange={ evt => onChangeTtfItem(evt, index)} 
						   className={`${item.type=='dot'?'dot':'comma'} sentence-item-ttf sentence-item-ttf-${index} `+cls}
						   placeholder="Ttf Text">
				</textarea>	
				</div>
				
			</div>)
 
}