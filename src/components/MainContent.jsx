import {useEffect} from "react"
import TtsApp from "./apps/TtsApp"

export default function MainContent({hideSidebar, config, socketConnected, ws}){
	const cls = "w-full px-4 sm:px-6 md:px-8";// pt-10
	return(<>
		<div id="main-content" className={cls +" "+ (hideSidebar?"":"lg:pl-72")}>
			<TtsApp socketConnected={socketConnected} 
					config={config} 
					ws={ws}/>
		</div>
	</>)
}