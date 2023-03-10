import {createRef, useState, useEffect} from "react"

import {
	inputDefaultCls,
	inputOkCls,
	inputErrorCls
} from "./deps/inputCls"

import Helper from "../../../lib/Helper"

export default function SentenceItemText({index,item, items, type}){
	const ocls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";
	const lcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
	const rcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"


	const loadingCls = ""
	let cls = ocls;		
	cls += item.type == 'dot' ? " " : " bg-gray-100"
	const inputRef = createRef(null)
	const onConvertItem = (evt, index) => {
		/*
		const node = this.state.sentences[index].ref.current;
		const text = node.value;
		delay(async()=>{
			await this.model.getSentences().updateItem(text, index, true);
		  await this.model.updateRow();
		  this.loadSentencesFormData()
			const ttfText = this.model.getContentTtf(true);
		 	this.stInputTtfRef.current.value = ttfText;
		 	this.setState({ttfText})	
		});
		*/
	}

	const onChangeTextItem = (evt, index) => {
		console.log(evt.target.value, index)
	}

	



	const loadFormData = ()=>{
		try{
			inputRef.current.value = item.text
		}catch(e){

		}
	}

	useEffect(()=>{
		loadFormData()
	},[])
	
	return(<div className={"sentence-text relative"}>
					<div className="absolute z-10 right-1">
							<div className="inline-flex shadow-sm">
							  <button title="Translate this line" 
							  		  disabled={item.loading} 
							  		  type="button" 
							  		  onClick = { evt => onConvertItem(evt, index) } 
							  		  className={lcls}>
							    {
							    	item.loading ? (<span className={loadingCls} role="status" aria-label="loading">
													    	<span className="sr-only">Loading...</span>
													  	</span>)
							    					 : (<i className="bi bi-translate"></i>)
							    }
							  </button>
							</div>
					</div>
					<div className="grow-wrap">
						<textarea ref={inputRef} 
								  onChange={ evt=> onChangeTextItem(evt,index)} 
								  className={ocls}  
								  placeholder="Text item">
						</textarea>
					</div>	
				</div>)
}