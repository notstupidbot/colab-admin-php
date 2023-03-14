import { Outlet , Link } from "react-router-dom"

export default function Dashboard(){
	const hideSidebar = false
	const cls = ""
	return(<>
<div id="main-content" className={cls +" "+ (hideSidebar?"":"lg:pl-72")}>

		<h2>This is Dashboard</h2>

		<div className="dashboard-item-container">
			<Outlet/>
		</div>
		</div>
	</>)
}