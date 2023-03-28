import {useEffect, useState, useRef} from "react"
import {  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,Route,Routes ,createHashRouter} from 'react-router-dom';

import Tts from "./apps/Tts"
import Dashboard from "./apps/Dashboard"
import Book from "./apps/Book"
import Preferences from "./apps/preferences"
import DashboardItem1 from "./apps/dashboard/DashboardItem1"
import DashboardItem2 from "./apps/dashboard/DashboardItem2"
import DashboardItem3 from "./apps/dashboard/DashboardItem3"
import DashboardItem4 from "./apps/dashboard/DashboardItem4"
import BootstrapIcons,{loader as bootstrapIconLoader} from "./apps/BootstrapIcons"


import ProjectTab, {loader as projectTabLoader} from "./apps/tts/ProjectTab";

import SentenceTab from "./apps/tts/SentenceTab";
import ProjectEditorTab,{loader as projectEditorTabLoader} from "./apps/tts/ProjectEditorTab";

import Explorer from "./apps/tts/ExplorerTab";
import SentenceEditorTab, {loader as sentenceEditorTabLoader} from "./apps/tts/SentenceEditorTabV2/SentenceEditorTab"; 
import SideBar from "./SideBar"
import Template from "./Template"

import TtsServerPrefTab, {loader as ttsServerPrefTabLoader} from "./apps/preferences/TtsServerPrefTab"

import ErrorPage from "./ErrorPage"
export default function Router({config}){
	
	const router = createHashRouter(
		  createRoutesFromElements(
		   <Route path="/" errorElement={<ErrorPage />} element={<Template config={config}/>}>

		      <Route exac path="/tts" element={<Tts config={config} />}>

					<Route  path="/tts/project" element={<ProjectTab  config={config}/>} loader={projectTabLoader}/>
					<Route exac path="/tts/project/page/:pageNumber" loader={projectTabLoader} element={<ProjectTab  config={config}/>}/>
					<Route exac path="/tts/project-editor/:projectId/:slug" loader={projectEditorTabLoader} element={<ProjectEditorTab  config={config}/>}/>
					<Route exac path="/tts/project-editor/:projectId/:slug/page/:pageNumber" loader={projectEditorTabLoader} element={<ProjectEditorTab  config={config}/>}/>
					<Route exac path="/tts/project-editor" element={<ProjectEditorTab config={config}/>}/>
					<Route exac path="/tts/sentence" element={<SentenceTab config={config}/>}/>
					<Route exac path="/tts/sentence-editor" loader={sentenceEditorTabLoader} element={<SentenceEditorTab config={config}/>}/>
					<Route exac path="/tts/sentence-editor/:pk/:slug" loader={sentenceEditorTabLoader} element={<SentenceEditorTab config={config}/>}/>

				</Route>
				<Route  path="/dashboard" element={<Dashboard/>}>
					
				</Route>
				<Route  path="/book" element={<Book/>}>
					
				</Route>
				<Route  path="/bootstrap-icons" loader={bootstrapIconLoader} element={<BootstrapIcons/>}></Route>
				<Route  path="/bootstrap-icons/page/:pageNumber" loader={bootstrapIconLoader} element={<BootstrapIcons/>}></Route>
				<Route  path="/preferences" element={<Preferences config={config}/>}>
					<Route exac path="/preferences/tts-server" loader={ttsServerPrefTabLoader} element={<TtsServerPrefTab config={config}/>}/>
					<Route index exac path="/preferences/tts-server/page/:pageNumber" loader={ttsServerPrefTabLoader} element={<TtsServerPrefTab config={config}/>}/>
					
				</Route>
			</Route>
				

		  )
		);
	return(<RouterProvider router={router}/>)
}