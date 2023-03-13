import {createRef, useState} from "react"

export default function SentenceAudioPreview(){
	const audioRef = createRef(null)
	const [audioOutput, setAudioOutput] = useState()
	return(<>
		<div className="audio-container">
			<audio controls ref={audioRef} className="-mt-2 -ml-3">
				<source src={audioOutput} />
			</audio>
		</div>
	</>)
}