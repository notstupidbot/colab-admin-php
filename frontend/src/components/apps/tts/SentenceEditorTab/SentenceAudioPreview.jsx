import {createRef, useState, useEffect, useRef} from "react"
import Helper from "../../../lib/Helper"
import Prx from "../../../lib/Prx"
import {v4} from "uuid"
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
			// console.log(pk)
			const asourceFilename = `${pk}.wav`
			const asource = `${config.getApiEndpoint()}/public/tts-output/${asourceFilename}?uuid=${v4()}`;

			Prx.get(`${config.getApiEndpoint()}/api/tts/auexist?filename=${asourceFilename}`).then(r=>{
				try{
					if(r.data.exist){
						setAudioOutput(asource)

					}
				}catch(e){}
			})
		}
	},[pk])

	useEffect(()=>{
		if(audioOutput){
			try{
				let player  = videojs(`aplayer-${pk}`);
				audioRef.current.load()
				// audioRef.current.play()
			}catch(e){
				console.log(e)
			}
			
		}
	},[audioOutput])
 
	return(<>
		<div className="audio-container mt-4" id={"audioPlayer-"+pk}>
		{/* style={{display:!showAudio?'none':'block'}}*/}
			<audio id={"aplayer-"+pk} controls="controls" preload="auto" data-setup='{"autoplay":false}' ref={audioRef} 
				   onCanPlay={e=>onCanPlay(e)}
			       onCanPlayThrough={e=>onCanPlaytrough(e)}
			       onLoadedData={e=>onLoaded(e)} width="300" height="50"
			       className={"-mt-2 h-[30px] video-js vjs-default-skin "}>
				<source src={audioOutput} type="audio/x-wav"/>
			</audio>
		</div>
	</>)
}