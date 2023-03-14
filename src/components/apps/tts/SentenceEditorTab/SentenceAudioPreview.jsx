import {createRef, useState} from "react"

export default function SentenceAudioPreview(){
	const audioRef = createRef(null)
	const [audioOutput, setAudioOutput] = useState()
	const [showAudio, setShowAudio] = useState(false)
	const onCanPlay = evt => {}
	const onCanPlaytrough = evt => {}
	const onLoaded = evt => {}
	return(<>
		<div className="audio-container">
			<audio style={{visibility:showAudio?'visible':'hidden'}} controls ref={audioRef} 
				   onCanPlay={e=>onCanPlay(e)}
			       onCanPlayThrough={e=>onCanPlaytrough(e)}
			       onLoadedData={e=>onLoaded(e)}
			       className="-mt-2 -ml-3">
				<source src={audioOutput} />
			</audio>
		</div>
	</>)
}