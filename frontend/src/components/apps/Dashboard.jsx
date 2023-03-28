import { Outlet , Link } from "react-router-dom"

export default function Dashboard(){
	const hideSidebar = false
	const cls = ""
	return(<>
		<main className="dark:text-white">
			<h2>This is Dashboard</h2>

			<div className="dashboard-item-container">
				<Outlet/>
			</div>
		</main>
	</>)
}