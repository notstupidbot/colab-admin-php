import {createRef, useState} from "react"
import axios from "axios"

export default function FormBtns({socketConnected, title,
								   content,				   
								   contentTtf,
								   projectId,
								   items,
								   pk,
								   jobCheckerAdd,
									speakerId,
									ws,config,doToast}){
	const [onProcess, setOnProcess] = useState(false)
	const btnCls = "py-3 px-4 py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
	const loadingCls = "animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
	
	const runBtnRef = createRef(null)

	const onRunBtnClicked = async (evt) => {
		// console.log(`onRunBtnClicked`)
		// console.log({socketConnected, title,
		// 						   content,				   
		// 						   contentTtf,
		// 						   projectId,
		// 						   items,
		// 						   pk})
		setOnProcess(true)
		// console.log(contentTtf)

		const text = contentTtf
		
		const subscriber_id = ws.getSubcriberId();

		
		const speaker_id = speakerId;
		let url = `${config.getApiEndpoint()}/api/tts/job?subscriber_id=${subscriber_id}&job_name=tts&speaker_id=${speaker_id}`;
			
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
		setOnProcess(false)

		console.log(res)
	}

	
	return(<>
		<div className="text-right">
			<button className={btnCls} 
					data-hs-overlay="#confirmSaveRow">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-save" viewBox="0 0 16 16">
					  <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
					</svg>
				Save
			</button>
			<button className={ btnCls + " mx-2"}
					data-hs-overlay="#confirmInsertAllTtfText">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrows-collapse" viewBox="0 0 16 16">
					  <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8Zm7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0Zm-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0v-3.793Z"/>
					</svg>
				Insert All Ttf
			</button>
			<button disabled={onProcess || !socketConnected} 
					ref={runBtnRef} 
					onClick={evt=> onRunBtnClicked(evt)} 
					className={'btn-blue'}>
					{
						onProcess ? (<span className={loadingCls} role="status" aria-label="loading">
									<span className="sr-only">Loading...</span>
								</span>):""	
					}
					
					{
						socketConnected ? ( <span className="inline-flex justify-center items-center w-[16px] h-[16px] rounded-full bg-blue-600 text-white">
												<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
													<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
												</svg>
											</span> )
										: ( <span className="inline-flex justify-center items-center w-[16px] h-[16px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
												<svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
												<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
												</svg>
											</span> )
					}
				  		Run
				  	{
				  		!onProcess ? (<svg className="w-2.5 h-auto" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path fillRule="evenodd" clipRule="evenodd" d="M1 7C0.447715 7 -3.73832e-07 7.44771 -3.49691e-07 8C-3.2555e-07 8.55228 0.447715 9 1 9L13.0858 9L7.79289 14.2929C7.40237 14.6834 7.40237 15.3166 7.79289 15.7071C8.18342 16.0976 8.81658 16.0976 9.20711 15.7071L16.0303 8.88388C16.5185 8.39573 16.5185 7.60427 16.0303 7.11612L9.20711 0.292893C8.81658 -0.0976318 8.18342 -0.0976318 7.79289 0.292893C7.40237 0.683417 7.40237 1.31658 7.79289 1.70711L13.0858 7L1 7Z" fill="currentColor"/>
									  </svg>):""
				  	}
				</button>
				</div>
	
	</>)
}