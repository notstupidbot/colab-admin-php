
import { Outlet , Link } from "react-router-dom"

export default function Puppeteer(){
	const hideSidebar = false
	const cls = ""
	return(<>
		<main className="dark:text-white">
			<h2>This is Puppeteer</h2>

			<div className="Puppeteer-item-container">
				<Outlet/>
			</div>
		</main>
	</>)
}