import React,{createRef, useState, useEffect} from "react";
import axios from "axios";
import ProjectItem from "./ProjectItem"
import AppConfig from "../../lib/AppConfig"
import Helper from "../../lib/Helper"
import { Link, useLoaderData } from 'react-router-dom';
const delay = Helper.makeDelay(512)
let loaderIsRunning = false;
let lastProject = null
export async function loader({ params }) {
	let currDate = (new Date).getTime()
	if(typeof localStorage.loaderIsRunning == 'undefined'){
		localStorage.loaderIsRunning = currDate
	}
	const lastDate = parseInt(localStorage.loaderIsRunning);

 	const timeBetween = currDate - lastDate 
 	console.log(timeBetween,lastProject)
 	if(lastProject != null){
 		if(lastProject.id == params.projectId){
	 		if(timeBetween < 15000){
				console.log(`skip`)
				localStorage.loaderIsRunning = currDate
				return { project: lastProject }
			}
		}
 	}
	

  const config = AppConfig.getInstance()	

  const res = await axios(`${config.getApiEndpoint()}/api/tts/project?id=${params.projectId}`);
  const project = res.data;
  if (!project) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  lastProject = project	
  localStorage.loaderIsRunning = currDate

  return { project };
}

export default function ProjectEditorTab(){
	const {project} = useLoaderData()

	const titleInputRef = createRef(null)
	// const saveBtnRef = null
	// const projectItemRef=null
	const inputErrorCls = "py-3 px-4 block w-full border-red-500 rounded-md text-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
	const inputOkCls = "py-3 px-4 block w-full border-green-500 rounded-md text-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
	const inputDefaultCls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";
	
	// constructor(){
	// 	super()
	// 	this.titleInputRef = React.createRef(null)
	// 	this.saveBtnRef = React.createRef(null)
	// 	this.projectItemRef = React.createRef(null)
	// }
 

	

	const loadRow = ()=>{
		// const project = this.props.activeProject;
		// if(!project){
		// 	return
		// }
		// this.setState({project},()=>{
		// 	this.loadFormData();
		// 	this.projectItemRef.current.updateList()
		// });
		

	}
	useEffect(()=>{
		delay(()=>{
			console.log(project)
			if(project){
				loadFormData()
			}	
		})
		
	},[project])

	const loadFormData = ()=>{
		titleInputRef.current.value = project.title;
	}

	const chTitleHandler = (evt)=>{

	}
	return(<>
		<div className="container">
		<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
			<label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Title</label>
		  <input onChange={evt=>chTitleHandler(evt)} ref={titleInputRef} type="text" id="inline-input-label-with-helper-text" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Project Title" aria-describedby="hs-inline-input-helper-text"/>
		  <p className="text-sm text-gray-500 mt-2" id="hs-inline-input-helper-text">{/*We'll never share your details.*/}</p>
		</div>
			 

			<ProjectItem project={project}/>

			
		</div>	
	</>)
}