import {useLoaderData} from "react-router-dom"
import Ui_se from "./Ui_se"
// import { useEffect, useState } from "react";
// import Helper from "../../../lib/Helper"

export async function loader({ params }) {
  return { sentenceId:params.pk };
}
/**
 * SentenceEditorTab 
 * Controller function component of Ui component
 * @component
 * @example 
 * const config = AppConfig.getInstance()
 * <SentenceEditorTab config={config}/>
 * */
const SentenceEditorTab = ({config}) => {
	const {sentenceId} = useLoaderData()
	
	return(<>
		<div className="SentenceEditorTabV2 dark:text-slate-500">
			<Ui_se pk={sentenceId} config={config}/>
		</div>
	</>)
}

export default SentenceEditorTab