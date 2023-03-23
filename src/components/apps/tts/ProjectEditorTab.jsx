import React,{createRef, useState, useEffect} from "react";
import axios from "axios";
import ProjectItem from "./ProjectItem"
import AppConfig from "../../lib/AppConfig"
import Helper from "../../lib/Helper"
import Prx from "../../lib/Prx"

import { Link, useLoaderData } from 'react-router-dom';
const delay = Helper.makeDelay(512)

export async function loader({ params }) {

  return { projectId: params.projectId, page: params.pageNumber||1 };
}

export default function ProjectEditorTab(){
	const {projectId, page} = useLoaderData()

	const titleInputRef = createRef(null)
	const [project,setProject] = useState(null)
	const inputErrorCls = "py-3 px-4 block w-full border-red-500 rounded-md text-sm focus:border-red-500 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
	const inputOkCls = "py-3 px-4 block w-full border-green-500 rounded-md text-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400";
	const inputDefaultCls = "py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400";

	const loadProject = async () => {
		 const config = AppConfig.getInstance()	
	  // await Helper.timeout(1000)
	  const res = await Prx.get(`${config.getApiEndpoint()}/api/tts/project?id=${projectId}`);
	  if(res){
	  	try{
	  		setProject(res.data)
	  	}catch(e){}
	  }
	}
	


	useEffect(()=>{
		if(projectId){
			delay(()=>{
				// console.log(projectId)
				loadProject()
			})
		}
	},[projectId])


	useEffect(()=>{
		if(project){
			document.title = "TTS Project Edit "+project.title

			loadFormData()
			$('#project-editor-tab').removeClass('hidden')
			$('#sentence-editor-tab').addClass('hidden')

			$('#project-editor-tab').unbind('click').click((evt)=>{
				document.location.href = evt.target.href;
				evt.preventDefault()
			})
			$('#project-editor-tab').prop('href',	`#/tts/project-editor/${project.id}/${project.slug}`)

		}
	},[project])


	useEffect(()=>{
		// console.log(page)
	},[page])




	const loadFormData = ()=>{
		titleInputRef.current.value = project.title;
	}

	
	const chTitleHandler = (evt)=>{
		const title = titleInputRef.current.value

		delay(async()=>{
			const data = new FormData();
			data.append('title', title)
			const res = await axios({
				method: "post",
				url: `${AppConfig.getInstance().getApiEndpoint()}/api/tts/project?id=${project.id}`,
				data: data,
				headers: { "Content-Type": "multipart/form-data" },
			});

			return res.data;
		})
	}
	return(<>
		<div className="container">
		<div className="sm:inline-flex sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
			<label htmlFor="inline-input-label-with-helper-text" className="block text-sm font-medium mb-2 dark:text-white">Title</label>
		  <input onChange={evt=>chTitleHandler(evt)} ref={titleInputRef} type="text" id="inline-input-label-with-helper-text" className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400" placeholder="Project Title" aria-describedby="hs-inline-input-helper-text"/>
		  <p className="text-sm text-gray-500 mt-2" id="hs-inline-input-helper-text">{/*We'll never share your details.*/}</p>
		</div>
			 
			{project?(<ProjectItem project={project} page={page}/>):""}
			

			
		</div>	
	</>)
}