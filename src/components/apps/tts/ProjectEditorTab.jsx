import React from "react";
import axios from "axios";
import ProjectItem from "./ProjectItem"

export default class ProjectEditorTab extends React.Component{
	state = {
		items : [],
		project : null,
		onProcess : false,
		inputStatus: 0,
	}

	titleInputRef = null
	saveBtnRef = null
	projectItemRef=null
	inputErrorCls = "py-3 px-4 block w-full border-red-500 rounded-md text-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
	inputOkCls = "py-3 px-4 block w-full border-green-500 rounded-md text-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
	inputDefaultCls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";
	
	constructor(){
		super()
		this.titleInputRef = React.createRef(null)
		this.saveBtnRef = React.createRef(null)
		this.projectItemRef = React.createRef(null)
	}
 

	componentDidMount(){
		// if(lastText){
		// 	this.updateSentences(lastText)
		// }
		// console.log(this.props.setA)
	}

	loadRow(){
		const project = this.props.activeProject;
		// console.log(project)
		if(!project){
			return
		}
		this.setState({project},()=>{
			this.loadFormData();
			this.projectItemRef.current.updateList()
		});
		

	}

	loadFormData(){
		this.titleInputRef.current.value = this.state.project.title;
	}

	chTitleHandler(evt){

	}
	render (){
	return(<>
		<div className="container">
		<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
			  	<label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Title</label>
		  <input onChange={evt=>this.chTitleHandler(evt)} ref={this.titleInputRef} type="text" id="inline-input-label-with-helper-text" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Project Title" aria-describedby="hs-inline-input-helper-text"/>
		  <p className="text-sm text-gray-500 mt-2" id="hs-inline-input-helper-text">{/*We'll never share your details.*/}</p>
		</div>
			 

			<ProjectItem ref={this.projectItemRef} project={this.state.project} setActiveTab={this.props.setActiveTab} setActiveSentence={this.props.setActiveSentence}/>

			
		</div>	
	</>)
}
}