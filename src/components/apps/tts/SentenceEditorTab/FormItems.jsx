import {createRef, useState} from "react"


import TitleEditor from "./TitleEditor"
import SentenceItemTaskQueueToolbar from "./SentenceItemTaskQueueToolbar"
import ContentEditor from "./ContentEditor"
import SentenceItemEditor from "./SentenceItemEditor"
import ContentTtfEditor from "./ContentTtfEditor"
import SentenceAudioPreview from "./SentenceAudioPreview"
import FormBtns from "./FormBtns"

export default function FormItems({socketConnected,
								   title, setTitle,
								   content, setContent,				   
								   contentTtf, setContentTtf,
								   projectId, setProjectId,
								   items, setItems,
								   pk, speakerId, config}){
	return(<>
		<div className="container">
			<TitleEditor title={title} setTitle={setTitle} pk={pk}/>
			<div className="relative my-3">
				<SentenceItemTaskQueueToolbar content={content} items={items} setItems={setItems} speakerId={speakerId} pk={pk}/>
				<ContentEditor content={content} setContent={setContent} pk={pk}/>
			</div>
			<SentenceItemEditor pk={pk} config={config} items={items} setItems={setItems} speakerId={speakerId}/>
			<ContentTtfEditor pk={pk}  contentTtf={contentTtf} setContentTtf={setContentTtf}/>

			<div className="columns-2 my-3">
				<SentenceAudioPreview pk={pk}/>
				<FormBtns   socketConnected={socketConnected} 
							title={title} setTitle={setTitle}
							content={content} setContent={setContent}
							contentTtf={contentTtf} setContentTtf={setContentTtf}
							items={items} setItems={setItems}
							projectId={projectId}/>
			</div>
		</div>
	</>)
}