import {Layout as ColabsibleSidebarLayout} from "../apps/collapsible-sidebar/Layout"
import LayoutEditor from "../apps/layout-editor/LayoutEditor" 
import {useEffect, useState, useRef} from "react"
import {  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,Route,Routes ,createHashRouter,Navigate} from 'react-router-dom';

import ErrorPage from "./ErrorPage"
import Template from "./Template"
import Public from "./Public"
import Admin from "./Admin"
export default function Router({config}){
	
	const router = createHashRouter(
		  createRoutesFromElements(
		   <Route path="/" errorElement={<ErrorPage />} element={<Template config={config}/>}>
		      <Route path="/" element={<Public />} />
              <Route path="public" element={<Public config={config} />}/>
		      <Route path="admin" element={<Admin config={config} />}>
		      	<Route path="layout-editor" element={<LayoutEditor config={config} />}/>
		      	<Route path="collabsible-sidebar" element={<ColabsibleSidebarLayout config={config} />}/>

			  </Route>
		      {/* <Route path="*" element={<Navigate to="/public" replace={true}/>} /> */}

			</Route>
		  )
		);
	return(<RouterProvider router={router}/>)
}