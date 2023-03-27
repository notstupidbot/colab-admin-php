import React, {useState, useEffect, useRef} from "react"
let firstTimer = true
import Helper from "../../../lib/Helper"
const delay = Helper.makeDelay(500)
let lastTimer = 0;
class AutosaveBehavior extends React.Component{
	state = {
		time : '',
		timer : 0,
		timerStarted : false,
		lastSaveDate : new Date,
		infoText : '',
		dotCount : 0,
		tick : 0,
		loading : false,
		enableAutoSave : true,
		prefSaveTimeout : 5,
		prefSaveTimeoutDevider : 3,
	}

	/* Reference object */
	project = null
	saveRecord = () => console.log('dummy saveRecord()')

	constructor(){
		super()
		
	}

	componentDidUpdate(){
		
		// console.log('updated')
		// this.initTimer()

	}
	// shouldComponentUpdate(){
	// 	console.log('should updated')
	// 	return false
	// }
	initTimer(){
		const {saveRecord,project, pk} = this.props 
		this.saveRecord = saveRecord
		this.project = project
		this.pk = pk
		if(this.pk){
			if(!this.state.timerStarted){
				// clearTimeout(timerRef.current)
				// clearTimeout(lastTimer)

				const tm = setTimeout(()=>{
					this.createClock()
					this.setState({timerStarted :true})
				},500)

				this.setState({timer :tm})
				
				
			}
		}else{
			// this.setState({timerStarted : false})
			// clearTimeout(timerRef.current)
			// clearTimeout(lastTimer)
		}
	}
	componentDidMount(){
		// const {saveRecord,project, pk} = this.props 
		// this.saveRecord = saveRecord
		// this.project = project
		// this.pk = pk
		// this.initTimer()

		
	}
	/*const [time,setTime] = useState("")
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
	*/

	/*
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
	*/
	createClock(){
		console.log(`createClock is running`)
		const today = new Date

		this.setState({dotCount: this.state.dotCount + 1 })
		
		let h = today.getHours()
		let m = today.getMinutes()
		let s = today.getSeconds()
		
		this.setState({tick : s % 3 == 0 ? 0 : 1 })

		h = this.clockCheckTime(h)
		m = this.clockCheckTime(m)
		s = this.clockCheckTime(s)

		const clock = `${h}:${m}:${s}`
		
		this.setState({time: clock })

		const timeBetween = (today - this.state.lastSaveDate)/3600;
		// console.log(timeBetween)
		
		if(timeBetween > this.state.prefSaveTimeout && this.state.enableAutoSave){
			// setDotCount(0)
			// setLoading(true)
			// setLastSaveDate(new Date)
			this.setState({
				dotCount : 0,
				loading : true,
				lastSaveDate : new Date,
				infoText : "Saving record"
			})
			
			// setInfoText()
			console.log(this.state.timer)

			if(lastTimer == this.state.timer){
				console.log(`lastTimer`)
				return
			}
			lastTimer = this.state.timer

			clearTimeout(lastTimer)
			
			this.saveRecord()
			
			setTimeout(()=>{
				// setInfoText()
				// setDotCount(0)
				// setLoading(false)
				this.setState({
					dotCount : 0,
					loading : false,
					lastSaveDate : new Date,
					infoText : `Last saved at ${clock}`
				})
			},3000)
			
		}
		// clearTimeout(timer)
		// clearTimeout(timerRef.current)

		const tm = setTimeout(()=>{
			if(this.state.timerStarted)
				this.createClock()
			else{
				clearTimeout(this.state.timer)
			}
		},500);
		
		this.setState({timer:tm})

	}
	clockCheckTime(i){
		if (i < 10) {
			i = `0${i}`
		}
		return i
	}

	onCkAutoSave_clicked(evt){
		console.log(evt.target.value)
		this.setState({enableAutoSave :evt.target.checked})

	}

	render(){
		const tmbLastSaved = ((new Date) - this.state.lastSaveDate)/3600
		const tmbLastSavedCeil = Math.ceil(tmbLastSaved)
		const autoSaveIn = Math.ceil((this.state.prefSaveTimeout + 1 - tmbLastSavedCeil)*this.state.prefSaveTimeoutDevider)
		const dotText = Array(this.state.dotCount).fill(1).map(r=>'.')
		const badgeCls = "max-w-[10rem] truncate whitespace-nowrap inline-block py-1.5 pt-3 px-3 rounded-md text-xs font-medium "
		const loadingCls = "animate-spin mt-[3px] inline-block w-2.5 h-2.5 border-[1px] border-current border-t-transparent text-blue-600 rounded-full"
		return(<>
			<div style={{zIndex:15}} className={"fixed bottom-0 left-1/2 -translate-x-1/2" }>
			<div className="dark:bg-slate-900 dark:text-slate-400 mb-4 px-2 rounded-md border-amber-400  flex">
				<div className="col-1">
				<span className={badgeCls}>
					<input className="checkbox -mt-1 mr-1" type="checkbox" onChange={f=>f} onClick={evt => this.onCkAutoSave_clicked(evt)} checked={this.state.enableAutoSave}/>
					{this.state.enableAutoSave && this.state.dotCount > 5  ? ` Autosave in ${autoSaveIn} s` : ""}
				</span>
				</div>			
				<div className="col-2">
				
				<span className={badgeCls}>
				{this.state.loading?(<div className={loadingCls} role="status" aria-label="loading">
	  <span className="sr-only">Loading...</span>
	</div>):""} {this.state.infoText} {tmbLastSaved <1 ? dotText : ""}
				</span>
				</div>
				<div className="col-3 mt-2 mx-2 text-blue-500">
					{this.state.enableAutoSave ? (this.state.tick == 0 ? (<i className="bi bi-cup-hot"/> ) : (<i className="bi bi-cup-hot-fill"/> ))  :""}
				</div>
			</div>
			</div>	
		</>)
	}
	
}

export default AutosaveBehavior