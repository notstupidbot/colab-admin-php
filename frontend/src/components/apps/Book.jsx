import { Outlet , Link } from "react-router-dom"
import React from "react"
import "jquery-ui/dist/themes/base/jquery-ui.css"
// import "jquery-ui/dist/themes/redmond/jquery-ui.css"
// import "jquery/dist/jquery.js"
import "jquery-ui/dist/jquery-ui.js"
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

class Mouse extends React.Component {
	render() {
		return <div>
			<div style={{border: '1px solid red'}}
				 onMouseOverCapture={((event)=>{
					console.log('mouse over on capture event')
					console.dir(event, this)}).bind(this)}
			onMouseOver={((event)=>{
				console.log('mouse over on bubbling event')
				console.dir(event, this)}).bind(this)} >
			Open DevTools and move your mouse cursor over here
			</div>
		</div>
	}
}
class Radio extends React.Component {
	constructor(props) {
		super(props)
		this.handleResize = this.handleResize.bind(this)
		let order = props.order
		let i = 1
		this.state = {
			outerStyle: this.getStyle(4, i),
			innerStyle: this.getStyle(1, i),
			selectedStyle: this.getStyle(2, i),
			taggerStyle: {
				top: order * 20, 
				width: 25, 
				height: 25
			}
		}
	}
	getStyle(i, m) {
		let value = i*m
		return {
			top: value,
			bottom: value,
			left: value,
			right: value,
		}
	}
	componentDidMount() {
		window.addEventListener('resize', this.handleResize)
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize)
	}
	handleResize(event) {
		let w = 1 + Math.round(window.innerWidth / 300)
		this.setState({
			taggerStyle: {
				top: this.props.order * w * 10, 
				width: w*10, 
				height: w * 10
			},
			textStyle: {
				left: w*13, 
				fontSize: 7*w
			}
		})
	}

	render() {
		return <div>
				<div className="radio-tagger" style={this.state.taggerStyle}>
					<input type="radio" name={this.props.name} id={this.props.id}/>
					<label htmlFor={this.props.id}>
						<div className="radio-text" style={this.state.textStyle}>
							{this.props.label}
						</div>
						<div className="radio-outer" style={this.state.outerStyle}>
							<div className="radio-inner" style={this.state.innerStyle}>
								<div className="radio-selected" style={this.state.selectedStyle}> </div>
							</div>
						</div>
					</label>
				</div>
			</div>
		}

}
class SliderValue extends React.Component {
	constructor(props) {
		super(props)
		this.handleSlide = this.handleSlide.bind(this)
		this.state = {sliderValue: 0}
	}
	handleSlide(event) {
		this.setState({sliderValue: event.detail.ui.value})
	}
	componentDidMount() {
		window.addEventListener('slide', this.handleSlide)

		// let handleChange = (e, ui)=>{
		// 	var slideEvent = new CustomEvent('slide', {
		// 			detail: {ui: ui, jQueryEvent: e
		// 		})	
		// 	})
		// 	window.dispatchEvent(slideEvent)
		// }
		$( '#slider' ).slider({
			// 'change': handleChange,
			// 'slide': handleChange
		})
	}
	componentWillUnmount() {
		window.removeEventListener('slide', this.handleSlide)
	}
	render() {
		return <div className="" >
			Value: {this.state.sliderValue}
		</div>
	}
}
class SliderButtons extends React.Component {
	constructor(props) {
		super(props)
		this.handleSlide = this.handleSlide.bind(this)
		this.handleChange = this.handleChange.bind(this)

		this.state = {sliderValue: 0}
	}
	handleSlide(event, ui) {
		this.setState({sliderValue: ui.value})
	}
	handleChange(value) {
		return ()=> {
			$('#slider').slider('value', this.state.sliderValue + value)
			this.setState({sliderValue: this.state.sliderValue + value})
		}
	}
	componentDidMount() {
		$('#slider').slider().on('slide', this.handleSlide)
	}
	componentWillUnmount() {
		$('#slider').off('slide', this.handleSlide)
	}
	render() {
		return (<>
			<div className="container">
			<div id="slider" className="p4 w-1/2">
				<div className="btn-container mt-8">
				<button disabled={(this.state.sliderValue<1)?true:false}
						className="btn-blue mr-1"
						onClick={this.handleChange(-1)}>
						1 Less ({this.state.sliderValue-1})
				</button>
				<button disabled={(this.state.sliderValue>99) ? true : false}
						className="btn-blue"
						onClick={this.handleChange(1)}>
						1 More ({this.state.sliderValue+1})
				</button>
			</div>
			</div>
			</div>
			</>)
		}
}
export default function Book(){
	const hideSidebar = false
	const cls = "dark:text-white"
	return(<>
		<main className={cls}>
			<SliderButtons/>
		</main>
	</>)
}