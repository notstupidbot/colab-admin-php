import {useState, useEffect, useRef} from "react"
let firstTimer = true
import Helper from "../../../lib/Helper"
const delay = Helper.makeDelay(500)
const AutosaveBehavior = ({saveRecord})=>{
	const [time,setTime] = useState("")	
	const [timerStarted,setTimerStarted] = useState(false)
	const [lastSaveDate,setLastSaveDate] = useState(new Date)
	const [infoText,setInfoText] = useState("")
	const [dotCount,setDotCount] = useState(0)
	const prefSaveTimeout = 60
	const prefSaveTimeoutDevider = 3
	let saveTimeout = prefSaveTimeout; //seconds
	saveTimeout = saveTimeout / prefSaveTimeoutDevider;
	const lastSaveDateRef = useRef(null)
	lastSaveDateRef.current = lastSaveDate

	const dotCountRef = useRef(null)
	dotCountRef.current = dotCount
	const createClock = () => {
		const today = new Date
		setDotCount(dotCountRef.current+1)
		
		let h = today.getHours()
		let m = today.getMinutes()
		let s = today.getSeconds()

		h = clockCheckTime(h)
		m = clockCheckTime(m)
		s = clockCheckTime(s)
		const clock = `${h}:${m}:${s}`
		setTime(clock)
		const timeBetween = (today - lastSaveDateRef.current)/3600;
		// console.log(timeBetween)
		
		if(timeBetween > saveTimeout){
			setDotCount(0)

			setLastSaveDate(new Date)
			setInfoText("Saving record")
			saveRecord()
			setTimeout(()=>{
				setInfoText(`Last saved at ${clock}`)
				setDotCount(0)
			},3000)
		}
		delay(()=>{
			createClock()
		});
	}
	const clockCheckTime = (i) => {
		if (i < 10) {
			i = `0${i}`
		}
		return i
	}
	useEffect(()=>{
		if(!timerStarted){
			delay(()=>{
				createClock()
				setTimerStarted(true)
			})
			
		}
	},[timerStarted])
	const tmbLastSaved = ((new Date) - lastSaveDateRef.current)/3600
	const tmbLastSavedCeil = Math.ceil(tmbLastSaved)
	const dotText = Array(dotCount).fill(1).map(r=>'.')
	return(<>
		<div className="dark:text-white p-2">
			{time} {infoText} {tmbLastSaved<1?dotText : ` Autosave in ${(saveTimeout + 1 - tmbLastSavedCeil)*prefSaveTimeoutDevider} s` }
		</div>
	</>)
}

export default AutosaveBehavior