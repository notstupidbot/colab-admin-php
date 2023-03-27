import axios from "axios"
import Helper from "../../../lib/Helper"
const delay = Helper.makeDelay(500)
import {useEffect, useRef} from "react"
export default function SentenceItemTaskQueueToolbar({content, 
	items, setItems, pk, sentenceItems, setSentenceItems,
	sentenceItemRefs, setSentenceItemRefs,sentenceItemTaskRefs, 
	setSentenceItemTaskRefs, ws,socketConnected,
	jobCheckerAdd, doToast, speakerId, config}){
	const sentenceItemTaskRefs_ = useRef(null)
	sentenceItemTaskRefs_.current = sentenceItemTaskRefs;
	const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"

	const buildItems = ()=>{

		const textList = content.split('.');

		let tmpSentences = [];
		const dotSentences = content.split('.');
		let source_index = 0;
		for(let i in dotSentences){
			const commaSentence = dotSentences[i].split(',');

			if(commaSentence.length > 1){
				const lastIndex = commaSentence.length - 1;
				for(let j in commaSentence){
					const text = commaSentence[j].replace(/^\s+/,'');
					const type = j == lastIndex ? 'dot':'comma';
					if(text.length){
						const si = {
							text : Helper.fixTttsText(text), 
							type,
							ttf:''
						};
						if(si.text != '')
							tmpSentences.push(si)
						source_index += 1;
					}
					
				}
			}else{
				const text = commaSentence[0].replace(/^\s+/,'');
				if(text.length){
					const si = {
						text : Helper.fixTttsText(text), 
						type : 'dot',
						ttf : '',
					}
					if(si.text != '')
						tmpSentences.push(si)
					source_index += 1;
				}
			}
		}
		setItems(tmpSentences);
	}
	const onExtractContent = evt => {
		console.log(content)
		buildItems();
	}

	const onConvertTask = async(evt) => {
		// onConvertTask(evt)
		const newSentenceItems = [];
		let sentenceItemRefs_tmp;
		for(let index in sentenceItems){
			const sentenceItem = sentenceItems[index];
			const inputRefCurrent = document.querySelector(`.sentence-item-text-${index}`)
			const ttfRefCurrent = document.querySelector(`.sentence-item-ttf-${index}`)
			const text = inputRefCurrent.value;
			sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs);
			sentenceItemRefs_tmp[index].loading = true;
			setSentenceItemRefs(sentenceItemRefs_tmp);

			const res = await axios(`${config.getApiEndpoint()}/api/tts/convert?text=${encodeURI(text)}`);
			let ttf = ''; 
			for(let k in res.data){
				if(typeof res.data[k] == 'object')
					ttf += res.data[k].ttf + ' '
			}
			ttfRefCurrent.value = ttf;
			sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs);
			sentenceItemRefs_tmp[index].loading = false;
			setSentenceItemRefs(sentenceItemRefs_tmp);

			// sentenceItem.ttf = ttf;
			// newSentenceItems.push(sentenceItem)
		}
		// setSentenceItems(newSentenceItems);
	}

	const onSynthesizeTask = async(evt) => {
		const lastConfig = sentenceItemTaskRefs_.current;
		// console.log(lastConfig)
		if(!lastConfig.queuSynthesizeTask){
			// task not executed
			const config = { 
				queuSynthesizeTask:true, 
				currentQueueSynthesizeIndex : -1,
				status : -1,
				running : true,
				nextIndex : 0
			}

			setSentenceItemTaskRefs(config)

		}
		// task already executed
		else{
			const lastIndex  = lastConfig.currentQueueSynthesizeIndex
			const lastStatus = lastConfig.status
			// init
			if(lastStatus == 0){

			}
			// onProcess
			else if(lastStatus == 1){
				
			}
			// onComplete
			else if(lastStatus == 2){
				
			}
		}
	


		
	}
	const synthesizeTask = async()=>{
		
		let taskCfg = sentenceItemTaskRefs_.current
		if(!taskCfg.running){
			return;
		}
		if(!socketConnected){
			doToast('SentenceItemTaskQueueToolbar.synthesizeTask() Socket not connected !', false)
			const nTaskCfg = Object.assign({},sentenceItemTaskRefs_.current);
			nTaskCfg.running = false
			nTaskCfg.nextIndex = -1
			nTaskCfg.queuSynthesizeTask = false
			nTaskCfg.status = -1
			nTaskCfg.job = null

			setSentenceItemTaskRefs(nTaskCfg)
			return;
		}
		if(taskCfg.currentQueueSynthesizeIndex == -1){
			console.log(`First Timer`)
			taskCfg.currentQueueSynthesizeIndex = 0;
			taskCfg.nextIndex = 1;
			taskCfg.status = 1;
			taskCfg.job = null;
		}
		// console.log(taskCfg);

		if(taskCfg.job != null){
			taskCfg.currentQueueSynthesizeIndex += 1;
			taskCfg.nextIndex += 1;
			taskCfg.status = 1;
			taskCfg.job = {last_job:true};
		}else{

		}

		/*****************************************************************/
		let sentenceItemRefs_tmp;
		const index = taskCfg.currentQueueSynthesizeIndex
		const maxLength = $('.sentence-item-ttf').length;
		console.log(index)
		console.log(maxLength)
		if(index >= maxLength){
			console.log(`Task item reach the end of index`)
			const nTaskCfg = Object.assign({},sentenceItemTaskRefs_.current);
			nTaskCfg.running = false
			nTaskCfg.nextIndex = -1
			nTaskCfg.queuSynthesizeTask = false
			nTaskCfg.status = -1
			nTaskCfg.job = null

			setSentenceItemTaskRefs(nTaskCfg)
			return
		}

		sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs);
		sentenceItemRefs_tmp[index].loadingTtf = true;
		setSentenceItemRefs(sentenceItemRefs_tmp);
		const ttfRefCurrent = document.querySelector(`.sentence-item-ttf-${index}`)

		const text = ttfRefCurrent.value
		
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
		/*****************************************************************/
	}
	useEffect(()=>{

		synthesizeTask();

	},[sentenceItemTaskRefs])
	
	const btnCls = "py-1 px-1 mx-2 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"

	return(<div className="absolute z-10 right-1">
		<div className="inline-flex shadow-sm">
			<button title="Extract Lines" type="button" onClick={ evt => onExtractContent(evt) } 
					className={btnCls}>
				<i className="bi bi-list-check"></i>
			</button>
			<button title="Translate All" type="button" onClick={ evt => onConvertTask(evt) } className={btnCls}>
			{
				false ? (<span className={loadingCls} role="status" aria-label="loading">
												    	<span className="sr-only">Loading...</span>
												  	</span>) : (<i className="bi bi-translate"></i>)
			}
				
				
			</button>
			<button disabled={sentenceItemTaskRefs_.current.queuSynthesizeTask} title="Synthesize All" type="button" onClick={ evt => onSynthesizeTask(evt) } className={btnCls}>
			
			{
				sentenceItemTaskRefs_.current.queuSynthesizeTask ? (<span className={loadingCls} role="status" aria-label="loading">
												    	<span className="sr-only">Loading...</span>
												  	</span>) : (<i className="bi bi-soundwave"></i>)
			}
				
			</button>
		</div>
	</div>)
}