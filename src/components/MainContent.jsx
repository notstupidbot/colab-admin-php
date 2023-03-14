import {useEffect} from "react"
import TtsApp from "./apps/TtsApp"
import {  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,Route,Routes } from 'react-router-dom';

import Dashboard from "./apps/Dashboard"
import DashboardItem1 from "./apps/dashboard/DashboardItem1"
import DashboardItem2 from "./apps/dashboard/DashboardItem2"
import DashboardItem3 from "./apps/dashboard/DashboardItem3"
import DashboardItem4 from "./apps/dashboard/DashboardItem4"


import ProjectTab, {loader as projectTabLoader} from "./apps/tts/ProjectTab";

import SentenceTab from "./apps/tts/SentenceTab";
import ProjectEditorTab from "./apps/tts/ProjectEditorTab";
import Explorer from "./apps/tts/ExplorerTab";
import SentenceEditorTab from "./apps/tts/SentenceEditorTab/Ui"; 
import SideBar from "./SideBar"
import Root from "./apps/tts/routes/root"
export default function MainContent({hideSidebar, config, socketConnected, ws}){
	const router = createBrowserRouter(
		  createRoutesFromElements(
		   <Route path="/" element={<Root />}>

		        <Route exac path="/tts" element={<TtsApp socketConnected={socketConnected} 
														 config={config} 
														 ws={ws}/>}>
					<Route  path="/tts/project" 
							element={<ProjectTab />} 
							loader={projectTabLoader}/>
					<Route exac path="/tts/project/page/:pageNumber" loader={projectTabLoader} element={<ProjectTab />}/>
					<Route exac path="/tts/project-editor/:projectId" element={<ProjectEditorTab/>}/>
					<Route exac path="/tts/project-editor" element={<ProjectEditorTab/>}/>
					<Route exac path="/tts/sentence" element={<SentenceTab/>}/>
					<Route exac path="/tts/sentence-editor" element={<SentenceEditorTab/>}/>

				</Route>
				<Route  path="/dashboard" element={<Dashboard/>}>
					
				</Route>
			</Route>
				

		  )
		);
	return(<RouterProvider router={router}/>)
}