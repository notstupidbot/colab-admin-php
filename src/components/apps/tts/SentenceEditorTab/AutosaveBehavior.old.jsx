import {useState, useEffect, useRef} from "react"
let firstTimer = true
import Helper from "../../../lib/Helper"
const delay = Helper.makeDelay(500)
let lastTimer = 0;
const AutosaveBehavior = ({saveRecord, project, pk})=>{
	const [time,setTime] = useState("")
	const [timer,setTimer] = useState(null)	
	const [timerStarted,setTimerStarted] = useState(false)
	const [lastSaveDate,setLastSaveDate] = useState(new Date)
	const [infoText,setInfoText] = useState("")
	const [dotCount,setDotCount] = useState(0)
	const [tick,setTick] = useState(0)
	const [loading,setLoading] = useState(0)
	const [enableAutoSave,setEnableAutoSave] = useState(true)
	const prefSaveTimeout = 70
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

	const enableAutoSaveRef = useRef(null)
	enableAutoSaveRef.current = enableAutoSave

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
		
		if(timeBetween > saveTimeout && enableAutoSaveRef.current){
			setDotCount(0)
			setLoading(true)
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
				setLoading(false)
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

	const onCkAutoSave_clicked = evt => {
		console.log(evt.target.value)
		setEnableAutoSave(evt.target.checked)

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
	const autoSaveIn = Math.ceil((saveTimeout + 1 - tmbLastSavedCeil)*prefSaveTimeoutDevider)
	const dotText = Array(dotCount).fill(1).map(r=>'.')
	const badgeCls = "max-w-[10rem] truncate whitespace-nowrap inline-block py-1.5 pt-3 px-3 rounded-md text-xs font-medium "
	const loadingCls = "animate-spin mt-[3px] inline-block w-2.5 h-2.5 border-[1px] border-current border-t-transparent text-blue-600 rounded-full"
	return(<>
		<div style={{zIndex:15}} className={"fixed bottom-0 left-1/2 -translate-x-1/2" }>
		<div className="dark:bg-slate-900 dark:text-slate-400 mb-4 px-2 rounded-md border-amber-400  flex">
			<div className="col-1">
			<span className={badgeCls}>
				<input className="checkbox -mt-1 mr-1" type="checkbox" onChange={f=>f} onClick={evt => onCkAutoSave_clicked(evt)} checked={enableAutoSave}/>
				{enableAutoSave && dotCountRef.current > 5  ? ` Autosave in ${autoSaveIn} s` : ""}
			</span>
			</div>			
			<div className="col-2">
			
			<span className={badgeCls}>
			{loading?(<div className={loadingCls} role="status" aria-label="loading">
  <span className="sr-only">Loading...</span>
</div>):""} {infoText} {tmbLastSaved <1 ? dotText : ""}
			</span>
			</div>
			<div className="col-3 mt-2 mx-2 text-blue-500">
				{enableAutoSave ? (tick == 0 ? (<i className="bi bi-cup-hot"/> ) : (<i className="bi bi-cup-hot-fill"/> ))  :""}
			</div>
		</div>
		</div>	
	</>)
}

export default AutosaveBehavior