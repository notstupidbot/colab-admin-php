import { Outlet } from 'react-router-dom';
import SideBar from "./SideBar"
export default function Template({}){
		 
	return(<>
		<SideBar/>
		<Outlet/>
	</>)	
}