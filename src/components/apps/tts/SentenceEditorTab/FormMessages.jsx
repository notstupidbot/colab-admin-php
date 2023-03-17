import {createRef} from "react"
import JobChecker from "../JobChecker"
import ModalConfirm from "../ModalConfirm"
import Toast from "../Toast"

export default function FormMessages({
	onInsertAllTttf_clicked, 
	onSave_clicked, 
	toastMessage, 
	hideToast, 
	showToast, 
	toastStatus,
	jobCheckerRef}){
	
	return(<>
		<JobChecker ref={jobCheckerRef}/>
		<ModalConfirm id="confirmInsertAllTtfText" 
					  title="Insert All TTF Text ?" 
					  content="This action will replace result on currently saved final TTF Text" 
					  cancelText="Cancel" 
					  okText="Okay, Do it!" 
					  onOk={ evt => onInsertAllTttf_clicked(evt)} 
					  onCancel={evt=>{}} />
		<ModalConfirm id="confirmSaveRow" 
					  title="Save Sentence ?" 
					  content="This action will save current sentence in database" 
					  cancelText="Cancel" 
					  okText="Okay, Do it!" 
					  onOk={ evt => onSave_clicked(evt)} 
					  onCancel={evt=>{}} />

		<Toast id="my-toast" message={toastMessage} 
							 onClose={evt=>hideToast(evt)} 
							 show={showToast} 
							 status={toastStatus}/>
    </>)
}