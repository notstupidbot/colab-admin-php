import React from "react"

export default class JobChecker extends React.Component{
	state = {
		job_list : [
			{id:'job_id',title:'title', message:'test message', type: 'info'}
		]
	}
	render(){
	return (<>
<div>
	{
	this.state.job_list.map((job,index)=>{
		return(
			<div style={{zIndex:15}} className="fixed  top-0 left-0 bg-white border rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700" role="alert">
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
			      {/*
			      <div className="mt-4">
			        <div className="flex space-x-3">
			          <button type="button" className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm">
			            Don't allow
			          </button>
			          <button type="button" className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm">
			            Allow
			          </button>
			        </div>
			      </div>
			      */}
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