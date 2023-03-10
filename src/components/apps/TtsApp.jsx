
import React ,{useEffect,useState,useRef}from "react"

let dontRunTwice=true;
let lastActiveTab = localStorage.activeTab || 'project';

import ProjectTab from "./tts/ProjectTab";
import SentenceTab from "./tts/SentenceTab";
import ProjectEditorTab from "./tts/ProjectEditorTab";
import Explorer from "./tts/ExplorerTab";
import SentenceEditorTab from "./tts/SentenceEditorTab/Ui";
import { Link } from 'react-router-dom';

export default function TtsApp({config, ws, socketConnected, mainContent}){

	const projectEditorTabRef = useRef(null);
	const sentenceEditorTabRef = useRef(null);
	const sentenceTabRef = useRef(null);
	const projectTabRef = useRef(null);

	const [activeTab, setActiveTab] = useState();
	const [activeProject, setActiveProject] = useState();
	const [activeSentence,setActiveSentence] = useState(null);

	const tabs = [
		{name:'project'},
		{name:'project-editor'},
		{name:'sentence-editor'},
		{name:'explorer'},
		{name:'sentence'}
	]

	const activeTabCls = (tabName)=>{
		if(tabName == activeTab){
			return "hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 active";
		}
		return "hs-tab-active:border-b-blue-600 hs-tab-active:text-gray-900 dark:hs-tab-active:text-white dark:hs-tab-active:border-b-blue-600 relative min-w-0 flex-1 bg-white first:border-l-0 border-l border-b-2 py-4 px-4 text-gray-500 hover:text-gray-700 text-sm font-medium text-center overflow-hidden hover:bg-gray-50 focus:z-10 dark:bg-gray-800 dark:border-l-gray-700 dark:border-b-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-300"
	}
	const activePanelCls = (tabName)=>{
		if(tabName == activeTab){
			return "";
		}
		return "hidden";
	}
	const activateTabHandler = (tabName) =>{
		localStorage.activeTab = tabName;
		setActiveTab(tabName);
	}

	useEffect(()=>{
		console.log(`${activeTab}`)
		localStorage.activeTab = activeTab;
		if(activeTab == 'sentence'){
			try{
				sentenceTabRef.current.updateList();
			}catch(e){

			}
		}
		
	},[activeTab])

	useEffect(()=>{
		if(activeSentence){
			// sentenceEditorTabRef.current.loadRow();
		}
	},[activeSentence]);

	useEffect(()=>{
		if(activeProject){
			projectEditorTabRef.current.loadRow();
		}
	},[activeProject]);

	useEffect(()=>{
		if(dontRunTwice){
			setActiveTab(lastActiveTab);
			dontRunTwice = false
		}
	});

	
return(<>


<nav className="relative z-0 flex border rounded-xl overflow-hidden dark:border-gray-700">
  <Link to="/tts/project"
  			className={activeTabCls('project')} >
    TTS Project
  </Link>
  <button type="button" tab="editor" onClick={evt=>activateTabHandler('project-editor')} className={activeTabCls('project-editor')} id="bar-with-underline-item-2" data-hs-tab="#bar-with-underline-2" aria-controls="bar-with-underline-2" role="tab">
    Project Editor
  </button>
  <button type="button" tab="project" onClick={evt=>activateTabHandler('sentence')} className={activeTabCls('sentence')} id="bar-with-underline-item-1" data-hs-tab="#bar-with-underline-4" aria-controls="bar-with-underline-1" role="tab">
    TTS Sentences
  </button>
  
  <button type="button" tab="sentence-editor" onClick={evt=>activateTabHandler('sentence-editor')} className={activeTabCls('sentence-editor')} id="bar-with-underline-item-5" data-hs-tab="#bar-with-underline-5" aria-controls="bar-with-underline-5" role="tab">
    Sentence Editor
  </button>
  {/*<button type="button" tab="explorer" onClick={evt=>activateTabHandler('explorer')} className={activeTabCls('explorer')} id="bar-with-underline-item-3" data-hs-tab="#bar-with-underline-3" aria-controls="bar-with-underline-3" role="tab">
    Explorer
  </button>*/}
</nav>

<div className="mt-3">
  <div id="bar-with-underline-1"  className={activePanelCls('project')} role="tabpanel" aria-labelledby="bar-with-underline-item-1">
    <ProjectTab  setActiveTab={setActiveTab} 
    						 setActiveProject={setActiveProject} 
    						 activeTab={activeTab} 
    						 config={config}/>
  </div>
  <div id="bar-with-underline-2" className={activePanelCls('project-editor')} role="tabpanel" aria-labelledby="bar-with-underline-item-2">
  	<ProjectEditorTab ref={projectEditorTabRef} activeTab={activeTab} 
  																							activeProject={activeProject}  
  																							setActiveTab={setActiveTab} 
  																							setActiveSentence={setActiveSentence}
  																							config={config}/>

  </div>
  
  <div id="bar-with-underline-4" className={activePanelCls('sentence')} role="tabpanel" aria-labelledby="bar-with-underline-item-4">
	  <SentenceTab ref={sentenceTabRef} setActiveTab={setActiveTab} 
	  																	setActiveSentence={setActiveSentence}
	  																	activeTab={activeTab}
	  																	config={config}/>
  </div>

  <div id="bar-with-underline-5" className={activePanelCls('sentence-editor')} role="tabpanel" aria-labelledby="bar-with-underline-item-5">
	  <SentenceEditorTab  ws={ws} 
												config={config} 
												activeSentence={activeSentence} 
												socketConnected={socketConnected} 
												activeTab={activeTab}/>
  </div>
  <div id="bar-with-underline-3" className={activePanelCls('explorer')} role="tabpanel" aria-labelledby="bar-with-underline-item-3">
    
  </div>
</div>	

</>)
}