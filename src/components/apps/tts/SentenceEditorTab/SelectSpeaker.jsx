import {useState} from "react"
import speaker_ids from "./deps/speaker_ids"

export default function SelectSpeaker({speakerId, setSpeakerId}){

	const onChangeSpeakerId = evt => {
		const speaker_id = $(evt.target).find('option:selected').val();
		setSpeakerId(speaker_id);
		localStorage.lastSpeakerId = speaker_id;
	}
	
	const formatSpeakerName = (speaker) => {
		let speaker_display_name = speaker.alias != '' ? speaker.alias : speaker.name;
		return speaker_display_name = `${speaker_display_name}/${speaker.gender}/${speaker.age}/${speaker.fast?'Fast':'Low'} ` 
	}
	return(<div  style={{zIndex:15}} className="fixed  top-0 right-0 ">
		<select id="speaker_id" onChange={ evt => onChangeSpeakerId(evt)} 
				value={speakerId}>
			{
				speaker_ids.map((speaker,index)=>{
					return(<option key={index} value={speaker.name}>{formatSpeakerName(speaker)}</option>)
				})
			}            
      
    </select>
    </div>)
}