import {useState, useEffect, useRef} from "react"
let firstTimer = true
import Helper from "../../../lib/Helper"
const delay = Helper.makeDelay(500)
let lastTimer = 0;
const AutosaveBehavior = ({saveRecord, pk})=>{
	const [time,setTime] = useState("")
	const [timer,setTimer] = useState(null)	
	const [timerStarted,setTimerStarted] = useState(false)
	const [lastSaveDate,setLastSaveDate] = useState(new Date)
	const [infoText,setInfoText] = useState("")
	const [dotCount,setDotCount] = useState(0)
	const [tick,setTick] = useState(0)
	const prefSaveTimeout = 5
	const prefSaveTimeoutDevider = 3
	let saveTimeout = prefSaveTimeout; //seconds
	saveTimeout = saveTimeout / prefSaveTimeoutDevider;
	const lastSaveDateRef = useRef(null)
	const timerRef = useRef(null)
	lastSaveDateRef.current = lastSaveDate
	timerRef.current = timer
	const dotCountRef = useRef(null)
	dotCountRef.current = dotCount

	const tickRef = useRef(null)
	tickRef.current = tick

	const timerStartedRef = useRef(null)
	timerStartedRef.current = timer

	const createClock = () => {
		console.log(`createClock is running`)
		const today = new Date
		setDotCount(dotCountRef.current+1)
		
		let h = today.getHours()
		let m = today.getMinutes()
		let s = today.getSeconds()
		// if(s)
		// const newTick = tickRef.current + 1
		setTick(s % 3 == 0?0:1)


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
			console.log(timerRef.current)
			if(lastTimer == timerRef.current){
				console.log(`lastTimer`)
				return
			}
			lastTimer = timerRef.current
			clearTimeout(lastTimer)

			saveRecord()
			setTimeout(()=>{
				setInfoText(`Last saved at ${clock}`)
				setDotCount(0)
			},3000)
		}
		// clearTimeout(timer)
		// clearTimeout(timerRef.current)

		const tm = setTimeout(()=>{
			if(timerStartedRef.current)
				createClock()
			else{
				clearTimeout(timerRef.current)
			}
		},500);
		
		setTimer(tm)

	}
	const clockCheckTime = (i) => {
		if (i < 10) {
			i = `0${i}`
		}
		return i
	}
	useEffect(()=>{
		if(pk){
			if(!timerStarted){
				// clearTimeout(timerRef.current)
				// clearTimeout(lastTimer)

				const tm = setTimeout(()=>{
					createClock()
					setTimerStarted(true)
				},500)

				setTimer(tm)
				
			}
		}else{
			setTimerStarted(false)
			// clearTimeout(timerRef.current)
			// clearTimeout(lastTimer)
		}
		
		// console.log(pk)
	},[pk])
	const tmbLastSaved = ((new Date) - lastSaveDate)/3600
	const tmbLastSavedCeil = Math.ceil(tmbLastSaved)
	const autoSaveIn = (saveTimeout + 1 - tmbLastSavedCeil)*prefSaveTimeoutDevider
	const dotText = Array(dotCount).fill(1).map(r=>'.')
	return(<>
		<div className="dark:text-white p-2">
			{time} {infoText} {tmbLastSaved<1?dotText : ` Autosave in ${autoSaveIn} s` } {tick}
		</div>
	</>)
}

export default AutosaveBehavior