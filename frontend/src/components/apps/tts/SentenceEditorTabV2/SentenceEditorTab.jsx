import { useEffect, useState } from "react";
import {useLoaderData} from "react-router-dom"
import Ui from "./Ui"
import Helper from "../../../lib/Helper"

export async function loader({ params }) {
  return { sentenceId:params.pk };
}
const SentenceEditorTab = ({config}) => {
	const {sentenceId} = useLoaderData()

	return(<>
		<div className="SentenceEditorTabV2 dark:text-slate-500">
			<Ui pk={sentenceId} config={config}/>
		</div>
	</>)
}

export default SentenceEditorTab