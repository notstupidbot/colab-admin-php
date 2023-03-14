import {createRef, useState, useEffect} from "react"

import {
	inputDefaultCls,
	inputOkCls,
	inputErrorCls
} from "./deps/inputCls"

import Helper from "../../../app/Helper"

export default function SentenceItemTtf({index,item, items}){
	const ocls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";
	const lcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
	const rcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"


	const loadingCls = ""
	let cls = ocls;		
	cls += item.type == 'dot' ? " " : " bg-gray-100"
	
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
		/*
		const sentences = this.state.sentences;
		const item = sentences[index];
		const audioRef = item.audio_ref;
		const ttf = item.ttf;

	
		sentences[index].loading_ttf = true;
		this.setState({sentences})
		const job_res = await this.model.runTtsJob(ttf, true, index);
				
		const data = job_res.data;
		console.log(data)

		const job = data.job;

		this.jobCheckerAdd(job);
		this.doToast(`${job_res.data.sentence_id} index ${job_res.data.index} created`,true)
		*/
	}

	const loadFormData = ()=>{
		try{
			inputRef.current.value = item.ttf
		}catch(e){

		}
	}

	useEffect(()=>{
		loadFormData()
	},[])
	
	return(<div className={"sentence-ttf relative"}>
				<div className="absolute z-10 right-1">
						<div className="inline-flex shadow-sm">
						  <button title="Synthesize this line" 
						  		  disabled={item.loading_ttf} type="button" 
						  		  onClick={evt=>onSynthesizeItem(evt,index)} 
						  		  className={rcls}>
						    {
						    	item.loading_ttf ? (<span className={loadingCls} role="status" aria-label="loading">
													    	<span className="sr-only">Loading...</span>
													  	</span>)
						    						 : (<i className="bi bi-soundwave"></i>)
						    }
						  </button>
						  <div className="audio-container w-7 h-8  overflow-hidden mt-1 py-1 px-1 gap-2 -ml-px  first:ml-0  border">
								<audio controls ref={audioRef} 
									   style={{width:100,marginLeft:-17,marginTop:-16}}
									   className="">
				          			<source src={item.audio_source} />
				        		</audio>
							</div>
							</div>
				</div>
				<div className="grow-wrap">
				<textarea  ref={inputRef} 
						   onChange={ evt => onChangeTtfItem(evt, index)} 
						   className={cls}  
						   placeholder="Ttf Text">
				</textarea>	
				</div>
				
			</div>)
 
}