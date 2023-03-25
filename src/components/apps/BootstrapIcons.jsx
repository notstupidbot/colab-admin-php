import {useState, useEffect} from "react"

const BootstrapIcons = ({}) => {
	const hideSidebar = false
	const cls = "dark:text-white"

	return(<>
		<div id="main-content"  className={cls +" "+ (hideSidebar?"":"lg:pl-72")}>
		icons
		</div>
	</>)
}

export default BootstrapIcons;