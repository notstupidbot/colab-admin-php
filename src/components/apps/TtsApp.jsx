
import React ,{useEffect,useState,useRef}from "react"
import { useBetween } from "use-between";
import useSocketClient from "../../shared/useSocketClient";
import useSocketState from "../../shared/useSocketState";
const useSharedSocketState = () => useBetween(useSocketState);
const useSharedSocketClient = () => useBetween(useSocketClient)

import useActiveTabState from "./shared/useActiveTabState";
import useActiveProjectState from "./shared/useActiveProjectState";
const useSharedActiveTabState = () => useBetween(useActiveTabState);
const useSharedActiveProjectState = () => useBetween(useActiveProjectState)

let dontRunTwice=true;
let lastActiveTab = localStorage.activeTab || 'project';

import ProjectTab from "./tts/ProjectTab";
import SentenceTab from "./tts/SentenceTab";
import EditorTab from "./tts/EditorTab";
import Explorer from "./tts/ExplorerTab";
import SentenceEditorTab from "./tts/SentenceEditorTab";

export default function TtsApp(){

	const [displayName,setDisplayName] = useState("Push Server");
	const {socketConnected} = useSharedSocketState();
	const {socketClient} = useSharedSocketClient();
	const socketClientRef = useRef();
	socketClientRef.current = socketClient;

	const socketConnectedRef = useRef();
	const editorTabRef = useRef(null);
	const sentenceEditorTabRef = useRef(null);
	const sentenceTabRef = useRef(null);
	const projectTabRef = useRef(null);
	socketConnectedRef.current = socketConnected;

	const {activeTab, setActiveTab} = useSharedActiveTabState();
	const {activeProject, setActiveProject} = useSharedActiveProjectState();
	// setActiveTab(lastActiveTab);
	const [activeSentence,setActiveSentence] = useState(null);

	const tabs = [
		{name:'project'},
		{name:'editor'},
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
		editorTabRef.current.reloadData();
	},[activeProject])

	useEffect(()=>{
		// console.log(activeSentence);
		if(activeSentence){
			sentenceEditorTabRef.current.loadSentence();
			// setActiveTab('sentence-editor');
		}
	},[activeSentence]);

	useEffect(()=>{
		if(dontRunTwice){
			setActiveTab(lastActiveTab);
			dontRunTwice = false
		}
	});
return(<>

<h2>TTS Indonesia</h2>
<nav className="relative z-0 flex border rounded-xl overflow-hidden dark:border-gray-700" aria-label="Tabs" role="tablist">
  <button type="button" tab="project" onClick={evt=>activateTabHandler('project')} className={activeTabCls('project')} id="bar-with-underline-item-1" data-hs-tab="#bar-with-underline-1" aria-controls="bar-with-underline-1" role="tab">
    TTS Project
  </button>
  <button type="button" tab="project" onClick={evt=>activateTabHandler('sentence')} className={activeTabCls('sentence')} id="bar-with-underline-item-1" data-hs-tab="#bar-with-underline-4" aria-controls="bar-with-underline-1" role="tab">
    TTS Sentences
  </button>
  <button type="button" tab="editor" onClick={evt=>activateTabHandler('editor')} className={activeTabCls('editor')} id="bar-with-underline-item-2" data-hs-tab="#bar-with-underline-2" aria-controls="bar-with-underline-2" role="tab">
    Editor
  </button>
  <button type="button" tab="sentence-editor" onClick={evt=>activateTabHandler('sentence-editor')} className={activeTabCls('sentence-editor')} id="bar-with-underline-item-5" data-hs-tab="#bar-with-underline-5" aria-controls="bar-with-underline-5" role="tab">
    Sentence Editor
  </button>
  <button type="button" tab="explorer" onClick={evt=>activateTabHandler('explorer')} className={activeTabCls('explorer')} id="bar-with-underline-item-3" data-hs-tab="#bar-with-underline-3" aria-controls="bar-with-underline-3" role="tab">
    Explorer
  </button>
</nav>

<div className="mt-3">
  <div id="bar-with-underline-1"  className={activePanelCls('project')} role="tabpanel" aria-labelledby="bar-with-underline-item-1">
  
    <div className="container">
    	<ProjectTab/>
    </div>
  </div>
  <div id="bar-with-underline-2" className={activePanelCls('editor')} role="tabpanel" aria-labelledby="bar-with-underline-item-2">
    
  <div className="container">
  <EditorTab ref={editorTabRef} socketConnected={socketConnected} socketClient={socketClient} activeTab={activeTab} activeProject={activeProject}/>
  </div>
  </div>
  <div id="bar-with-underline-3" className={activePanelCls('explorer')} role="tabpanel" aria-labelledby="bar-with-underline-item-3">
    
  </div>
  <div id="bar-with-underline-4" className={activePanelCls('sentence')} role="tabpanel" aria-labelledby="bar-with-underline-item-4">
    
  <SentenceTab ref={sentenceTabRef} setActiveTab={setActiveTab} setActiveSentence={setActiveSentence} socketConnected={socketConnected} socketClient={socketClient} activeTab={activeTab}/>
  </div>

  <div id="bar-with-underline-5" className={activePanelCls('sentence-editor')} role="tabpanel" aria-labelledby="bar-with-underline-item-5">
    
  <SentenceEditorTab ref={sentenceEditorTabRef} activeSentence={activeSentence} socketConnected={socketConnected} socketClient={socketClient} activeTab={activeTab}/>
  </div>
</div>	

</>)
}