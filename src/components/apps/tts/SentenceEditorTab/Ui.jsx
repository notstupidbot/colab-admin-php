import {useState, useEffect} from "react"
import SelectSpeaker from "./SelectSpeaker"
import FormMessages from "./FormMessages"
import FormItems from "./FormItems"
import "./deps/auto-grow-textarea.css"

export default function SentenceEditorTab({ws, config, activeSentence, socketConnected, activeTab}){

	const [speakerId, setSpeakerId] = useState("wibowo")
	const [toastMessage, setToastMessage] = useState("")
	const [toastStatus, setToastStatus] = useState(true)
	const [showToast, setShowToast] = useState(false)

	/* Form Data Object*/
	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")
	const [contentTtf, setContentTtf] = useState("")
	const [items, setItems] = useState("[]")
	const [projectId, setProjectId] = useState("[]")
	const [pk, setPk] = useState("")


	const hideToast = () => setShowToast(false)
	const onSave_clicked = () => {
		console.log(`SentenceEditorTab.onSave_clicked`)
	}
	const onInsertAllTttf_clicked = () => {
		console.log(`SentenceEditorTab.onInsertAllTttf_clicked`)
	}

	useEffect(()=>{
		if(activeSentence){
			console.log(activeSentence)

			setTitle(activeSentence.title)
			setProjectId(activeSentence.project_id)
			setContent(activeSentence.content)
			setContentTtf(activeSentence.content_ttf)
			setItems(activeSentence.sentences)
			setPk(activeSentence.id)
		}
	},[activeSentence])

	return(<>	
		<SelectSpeaker speakerId={speakerId} setSpeakerId={setSpeakerId}/>
		<FormMessages toastMessage={toastMessage}
					  toastStatus={toastStatus}
					  showToast={showToast}
					  hideToast={hideToast}
					  onSave_clicked={onSave_clicked}
					  onInsertAllTttf_clicked={onInsertAllTttf_clicked}/>
		<FormItems socketConnected={socketConnected}
				   title={title} setTitle={setTitle}
				   content={content} setContent={setContent}
				   contentTtf={contentTtf} setContentTtf={setContentTtf}
				   projectId={projectId} setProjectId={setProjectId}
				   items={items} setItems={setItems}
				   pk={pk}
				   speakerId={speakerId}/>							
	</>)
}