import {createRef, useState, useEffect} from "react"

import TitleEditor from "./TitleEditor"
import SentenceItemTaskQueueToolbar from "./SentenceItemTaskQueueToolbar"
import ContentEditor from "./ContentEditor"
import SentenceItemEditor from "./SentenceItemEditor"
import ContentTtfEditor from "./ContentTtfEditor"
import SentenceAudioPreview from "./SentenceAudioPreview"
import FormBtns from "./FormBtns"
import AutosaveBehavior from "./AutosaveBehavior"
export default function FormItems({socketConnected,
								   title, setTitle,
								   content, setContent,				   
								   contentTtf, setContentTtf,
								   projectId, setProjectId,
								   items, setItems,
								   pk, speakerId, config, ws,
								   doToast,hideToast,jobCheckerAdd,
								   sentenceItemRefs, setSentenceItemRefs,
								   sentenceItemTaskRefs, setSentenceItemTaskRefs,
								audioOutput, setAudioOutput,saveRecord}){
	const [sentenceItems, setSentenceItems] = useState([]);
	const autoSaveRef = createRef(null)
	const onConvertTask = evt =>{
		console.log(`FormItems.onConvertTask`)
	}
	useEffect(()=>{
		autoSaveRef.current.initTimer()
	},[pk])
	return(<>
		<div className="container">
			<TitleEditor title={title} setTitle={setTitle} pk={pk} config={config}/>
			<div className="relative my-3">
				<SentenceItemTaskQueueToolbar ws={ws} sentenceItems={sentenceItems} setSentenceItems={setSentenceItems} content={content} items={items} setItems={setItems} speakerId={speakerId} pk={pk}
				sentenceItemRefs={sentenceItemRefs} 
				   setSentenceItemRefs={setSentenceItemRefs}
				   sentenceItemTaskRefs={sentenceItemTaskRefs} 
				   setSentenceItemTaskRefs={setSentenceItemTaskRefs}
				   jobCheckerAdd={jobCheckerAdd} doToast={doToast}
				   config={config}
				   socketConnected={socketConnected} />
				<ContentEditor config={config} content={content} setContent={setContent} pk={pk}/>
			</div>
			<SentenceItemEditor pk={pk} 
								sentenceItems={sentenceItems} 
								setSentenceItems={setSentenceItems} 
								config={config} 
								ws={ws} 
								socketConnected={socketConnected} 
								items={items} 
								setItems={setItems} 
								speakerId={speakerId}
								hideToast={hideToast}
							    doToast={doToast}
							    jobCheckerAdd={jobCheckerAdd}
							    sentenceItemRefs={sentenceItemRefs}
				   				setSentenceItemRefs={setSentenceItemRefs}/>
			<ContentTtfEditor config={config} pk={pk}  contentTtf={contentTtf} setContentTtf={setContentTtf}/>

			<div className="columns-2 my-3">
				<SentenceAudioPreview pk={pk} config={config} audioOutput={audioOutput} setAudioOutput={setAudioOutput}/>
				<AutosaveBehavior ref={autoSaveRef} saveRecord={saveRecord} pk={pk}/>
				<FormBtns   socketConnected={socketConnected} 
							title={title} setTitle={setTitle}
							content={content} setContent={setContent}
							contentTtf={contentTtf} setContentTtf={setContentTtf}
							items={items} setItems={setItems}
							projectId={projectId}
							jobCheckerAdd={jobCheckerAdd} doToast={doToast}
				   speakerId={speakerId} config={config} ws={ws} pk={pk}/>
			</div>
		</div>
	</>)
}