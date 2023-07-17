import { Outlet } from 'react-router-dom';
import {useEffect , useState} from "react"

export default function Template({config}){	
	return(<>
	  	<div id="main-content" >
			<Outlet/>
		</div>
	</>)	
}