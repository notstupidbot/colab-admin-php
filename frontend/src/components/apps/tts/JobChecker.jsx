import React,{useState} from "react"
import Helper from "../../lib/Helper"
class Job extends React.Component {
	id = ""
	title = ""
	message = ""
	type = ""
	stopTimer= true
	state = {
		inc : 0

	}
	testFn = ()=>{
		console.log('Test fn')
	}
	constructor(){
		super()

	}
	componentDidMount(){
			this.id = this.props.id
		this.title = this.props.title
		this.message = this.props.message
		this.type = this.props.type

		this.runTimer()
	}
	async runTimer(){
		this.setState({inc:0})
		let inc = this.state.inc;
		this.stopTimer = false
		while(!this.stopTimer){
			inc += 1;
			this.setState({inc})
			await Helper.timeout(1000);
		}
	}
	stopTimerCmd(){
		this.stopTimer = true
	}

	render(){
		return(<>
			<span className="dark:text-white">{this.state.inc}</span>
		</>)
	}
}

export default class JobChecker extends React.Component{

	state = {
		jobList : {}
	}
	addJob(job, index){
		// setJobList([...job_list,job]);
	}

	stopJob(index){

	}
	render(){
	return (<>
<div style={{zIndex:70}} className="fixed  top-0 left-0 ">
		{/*<h2 className="font-bold"> HELLO</h2>*/}

	{
	Object.keys(this.state.jobList).map((job_id,index)=>{
		const job = this.state.jobList[job_id];
		return(
			<div key={index} style={{zIndex:15}} className="bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700" role="alert">
			  <div className="flex p-4">
			    <div className="flex-shrink-0">
			      <svg className="h-5 w-5 text-gray-600 mt-1 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
			        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
			      </svg>
			    </div>
			    <div className="ml-4">
			      <h3 className="text-gray-800 font-semibold dark:text-white">
			        {job.title}
			      </h3>
			      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
			      	{job.message}
			      </div>
			      <Job id={job.id} title={job.title} message={job.message} type={job.type}/>
			    </div>
			  </div>
			</div>
		)	
	})
	}
</div>
	</>)
}
}