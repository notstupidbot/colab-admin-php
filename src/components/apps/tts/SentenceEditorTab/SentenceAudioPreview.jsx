import {createRef, useState, useEffect, useRef} from "react"
import Helper from "../../../lib/Helper"

export default function SentenceAudioPreview({config, audioOutput, setAudioOutput, pk}){
	const audioRef = createRef(null)
	// const pkRef = useRef(null)
	// pkRef.current = pk
	const [showAudio, setShowAudio] = useState(false)
	const onCanPlay = evt => {
		setShowAudio(true)
	}
	const onCanPlaytrough = evt => {}
	const onLoaded = evt => {}

	useEffect(()=>{
		// setShowAudio(false)
		// if(audioOutput == ""){
		// 	audioOutput = `${config.getApiEndpoint()}/public/tts-output/${pkRef.current}.wav`
		// 	setAudioOutput(audioOutput)
		// }
		// Helper.timeout(1000).then(e=>{
		// 	console.log(audioOutput)
		// 	if(audioOutput){
		// 		audioRef.current.load()
		// 		audioRef.current.play()
		// 	}
		// })
		if(pk){
			console.log(pk)
			const audioOutput_ = `${config.getApiEndpoint()}/public/tts-output/${pk}.wav`
			setAudioOutput(audioOutput_)
		}
	},[pk])

	useEffect(()=>{
		if(audioOutput){
			try{
				audioRef.current.load()
				// audioRef.current.play()
			}catch(e){}
			
		}
	},[audioOutput])
 
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