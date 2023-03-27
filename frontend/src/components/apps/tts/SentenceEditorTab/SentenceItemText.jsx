import {createRef, useState, useEffect} from "react"

import {
	inputDefaultCls,
	inputOkCls,
	inputErrorCls
} from "./deps/inputCls"

import Helper from "../../../lib/Helper"

import axios from "axios"
export default function SentenceItemText({onResizeItemArea,index,item,config,ws, items, type, setSentenceItems, sentenceItemRefs, setSentenceItemRefs}){
	const ocls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";
	const lcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
	const rcls = "mt-1 py-1 px-1 inline-flex justify-center items-center gap-2 -ml-px  first:ml-0  border font-medium bg-white text-gray-700 align-middle hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400"

	const [loading, setLoading] = useState(false)

	const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"

	let cls = ocls;		
	cls += item.type == 'dot' ? " " : " bg-gray-100"
	const inputRef = createRef(null)
	const onConvertItem = (evt, index) => {
		const text = inputRef.current.value;
		let sentenceItemRefs_tmp;
		Helper.delay(async()=>{
			sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs);
			sentenceItemRefs_tmp[index].loading = true;
			setSentenceItemRefs(sentenceItemRefs_tmp);

			const res = await axios(`${config.getApiEndpoint()}/api/tts/convert?text=${encodeURI(text)}`);
			let ttf = ''; 
			for(let k in res.data){
				ttf += res.data[k].ttf + ' '
			}

			const ttfRefCurrent = document.querySelector(`.sentence-item-ttf-${index}`)
			ttfRefCurrent.value = ttf.trim()
			sentenceItemRefs_tmp = Object.assign([], sentenceItemRefs);
			sentenceItemRefs_tmp[index].loading = false;
			setSentenceItemRefs(sentenceItemRefs_tmp);
			

		});
		
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

	const isLoading = (index)=>{
		if (typeof sentenceItemRefs[index] == 'object'){
			// if(sentenceItemRefs[index].loading){

			// }
			return sentenceItemRefs[index].loading
		}
		return false
	}
	useEffect(()=>{
		loadFormData()
	},[])
	
	return(<div className={"sentence-text relative"}>
		<div className="absolute z-10 right-1">
				<div className="inline-flex shadow-sm">
				  <button title="Translate this line" 
				  		  disabled={isLoading(index)} 
				  		  type="button" 
				  		  onClick = { evt => onConvertItem(evt, index) } 
				  		  className={lcls}>
				    {
				    	isLoading(index) ? (<span className={loadingCls} role="status" aria-label="loading">
										    	<span className="sr-only">Loading...</span>
										  	</span>)
				    					 : (<i className="bi bi-translate"></i>)
				    }
				  </button>
				</div>
		</div>
		<div className="grow-wrap">
			<textarea ref={inputRef}  style={{minHeight:40}}
					  onMouseUp={evt => onResizeItemArea(evt)}
					  onMouseLeave={evt => onResizeItemArea(evt)}
						   onMouseDown={evt => onResizeItemArea(evt)}
					  onChange={ evt=> onChangeTextItem(evt,index)} 
					  className={`${item.type=='dot'?'dot':'comma'} sentence-item-text sentence-item-text-${index} `+cls}
					  placeholder="Text item">
			</textarea>
		</div>	
	</div>)
}