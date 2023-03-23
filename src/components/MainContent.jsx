import {useEffect} from "react"
import TtsApp from "./apps/TtsApp"
import {  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,Route,Routes ,createHashRouter} from 'react-router-dom';

import Dashboard from "./apps/Dashboard"
import Book from "./apps/Book"
import Preferences from "./apps/preferences"
import DashboardItem1 from "./apps/dashboard/DashboardItem1"
import DashboardItem2 from "./apps/dashboard/DashboardItem2"
import DashboardItem3 from "./apps/dashboard/DashboardItem3"
import DashboardItem4 from "./apps/dashboard/DashboardItem4"


import ProjectTab, {loader as projectTabLoader} from "./apps/tts/ProjectTab";

import SentenceTab from "./apps/tts/SentenceTab";
import ProjectEditorTab,{loader as projectEditorTabLoader} from "./apps/tts/ProjectEditorTab";

import Explorer from "./apps/tts/ExplorerTab";
import SentenceEditorTab, {loader as sentenceEditorTabLoader} from "./apps/tts/SentenceEditorTab/Ui"; 
import SideBar from "./SideBar"
import Root from "./apps/tts/routes/root"

import TtsServerPrefTab, {loader as ttsServerPrefTabLoader} from "./apps/preferences/TtsServerPrefTab"

export default function MainContent({hideSidebar,setHideSidebar, config, socketConnected, ws}){
	const router = createHashRouter(
		  createRoutesFromElements(
		   <Route path="/" element={<Root hideSidebar={hideSidebar} setHideSidebar={setHideSidebar}/>}>

		      <Route exac path="/tts" element={<TtsApp socketConnected={socketConnected} 
														 config={config} 
														 ws={ws} hideSidebar={hideSidebar}/>}>
					<Route  path="/tts/project" 
							element={<ProjectTab />} 
							loader={projectTabLoader}/>
					<Route exac path="/tts/project/page/:pageNumber" loader={projectTabLoader} element={<ProjectTab />}/>
					<Route exac path="/tts/project-editor/:projectId/:slug" loader={projectEditorTabLoader} element={<ProjectEditorTab/>}/>
					<Route exac path="/tts/project-editor/:projectId/:slug/page/:pageNumber" loader={projectEditorTabLoader} element={<ProjectEditorTab/>}/>
					<Route exac path="/tts/project-editor" element={<ProjectEditorTab/>}/>
					<Route exac path="/tts/sentence" element={<SentenceTab/>}/>
					<Route exac path="/tts/sentence-editor" loader={sentenceEditorTabLoader} element={<SentenceEditorTab config={config} socketConnected={socketConnected} ws={ws}/>}/>
					<Route exac path="/tts/sentence-editor/:pk/:slug" loader={sentenceEditorTabLoader} element={<SentenceEditorTab config={config} socketConnected={socketConnected} ws={ws}/>}/>

				</Route>
				<Route  path="/dashboard" element={<Dashboard/>}>
					
				</Route>
				<Route  path="/book" element={<Book/>}>
					
				</Route>
				<Route  path="/preferences" element={<Preferences/>}>
					<Route exac path="/preferences/tts-server" loader={ttsServerPrefTabLoader} element={<TtsServerPrefTab/>}/>
					
				</Route>
			</Route>
				

		  )
		);
	return(<RouterProvider router={router}/>)
}