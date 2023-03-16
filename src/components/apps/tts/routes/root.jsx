import { Outlet } from 'react-router-dom';
import SideBar from "../../../SideBar"
export default function Root({hideSidebar, setHideSidebar}){
		 
	return(<>
		<SideBar hideSidebar={hideSidebar} setHideSidebar={setHideSidebar}/>
		<Outlet/>
	</>)	
}