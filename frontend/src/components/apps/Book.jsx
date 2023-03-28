import { Outlet , Link } from "react-router-dom"
import React from "react"
let ivs = [];
const AnalogDisplay = function AnalogDisplay(props) {
	let date = new Date(props.time)
	let dialStyle = {
		position: 'relative',
		top: 0,
		left: 0,
		width: 200,
		height: 200,
		borderRadius: 20000,
		borderStyle: 'solid',
		borderColor: 'black'
	}
	
	let secondHandStyle = {
		position: 'relative',
		top: 100,
		left: 100,
		border: '1px solid red',
		width: '40%',
		height: 1,
		transform: 'rotate(' + ((date.getSeconds()/60)*360 - 90 ).toString() + 'deg)',
		transformOrigin: '0% 0%',
		backgroundColor: 'red'
	}
	let minuteHandStyle = {
		position: 'relative',
		top: 100,
		left: 100,
		border: '1px solid grey',
		width: '40%',
		height: 3,
		transform: 'rotate(' + ((date.getMinutes()/60)*360 - 90 ).toString() + 'deg)',
		transformOrigin: '0% 0%',
		backgroundColor: 'grey'
	}
	
	let hourHandStyle = {
		position: 'relative',
		top: 92,
		left: 106,
		border: '1px solid grey',
		width: '20%',
		height: 7,
		transform: 'rotate(' + ((date.getHours()/12)*360 - 90 ).toString() + 'deg)',
		transformOrigin: '0% 0%',
		backgroundColor: 'grey'
	}
	
	return <div>
		<div style={dialStyle}>
			<div style={secondHandStyle}/>
			<div style={minuteHandStyle}/>
			<div style={hourHandStyle}/>
		</div>
	</div>
}
const DigitalDisplay = function(props) {
	return <div>{props.time}</div>
}
class Clock extends React.Component {
	constructor(props) {
		super(props)
		this.launchClock()
		this.state = {currentTime: (new Date()).toLocaleString()}
	}
	launchClock() {
		ivs.map(iv=>clearInterval(iv))
		const iv = setInterval(()=>{
		console.log(`Updating time...${iv}`)
			this.setState({
				currentTime: (new Date()).toLocaleString()
			})
		}, 1000)
		ivs.push(iv)
	}
	componentWillUnmount(){
		ivs.map(iv=>clearInterval(iv))

	}
	render() {
		console.log('Rendering Clock...')

		return <div>
			<AnalogDisplay time={this.state.currentTime}/>
			<DigitalDisplay time={this.state.currentTime}/>
		</div>
	}
}
export default function Book(){
	const hideSidebar = false
	const cls = "dark:text-white"
	return(<>
		<main className={cls}>
			<Clock/>
		</main>
	</>)
}