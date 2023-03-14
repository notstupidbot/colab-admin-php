
import React ,{useEffect,useState,useRef}from "react"
import { Outlet , Link,  HashRouter as Router, Routes, Route } from 'react-router-dom';

let dontRunTwice=true;
let lastActiveTab = localStorage.activeTab || 'project';

import ProjectTab from "./tts/ProjectTab";
import SentenceTab from "./tts/SentenceTab";
import ProjectEditorTab from "./tts/ProjectEditorTab";
import Explorer from "./tts/ExplorerTab";
import SentenceEditorTab from "./tts/SentenceEditorTab/Ui";
import SideBar from "../SideBar"
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
	const cls = "w-full px-4 sm:px-6 md:px-8";// pt-10

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

const 	hideSidebar = false
return(<>
<div id="main-content" className={cls +" "+ (hideSidebar?"":"lg:pl-72")}>
<nav className="relative z-0 flex border rounded-xl overflow-hidden dark:border-gray-700">
  <Link to="/tts/project"
  			className={activeTabCls('project')}>
    TTS Project
  </Link>
  <Link to="/tts/project-editor" className={activeTabCls('project-editor')}>
    Project Editor
  </Link>
  <Link to="/tts/sentence" className={activeTabCls('sentence')}>
    TTS Sentences
  </Link>
  
  <Link to="/tts/sentence-editor" onClick={evt=>activateTabHandler('sentence-editor')} 
  		  className={activeTabCls('sentence-editor')} >
    Sentence Editor
  </Link>
 
</nav>

<div className="mt-3">
  <Outlet/>
</div>	
</div>
</>)
}