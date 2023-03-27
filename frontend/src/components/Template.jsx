import { Outlet } from 'react-router-dom';
import SideBar from "./SideBar"
export default function Template({config}){
		 
	return(<>
		<SideBar config={config}/>
		<Outlet/>
	</>)	
}