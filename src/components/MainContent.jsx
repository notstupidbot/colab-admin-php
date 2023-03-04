import React,{userState} from "react"
import AppGrid from "./grid/AppGrid"
import SocketTesterChat from "./tester/SocketTesterChat"
import TtsApp from "./apps/TtsApp"
export default class MainContent extends React.Component{
	state = {
		sideBarHidden : true
	}
	cls = "w-full px-4 sm:px-6 md:px-8";// pt-10

	// hideSideBar(){
	// 	this.setState({sidebarHidden:1})
	// }

	componentDidMount(){
		// // console.log(this.props.sideBar)
		try{
			const sidebarHidden = this.props.sideBar.current.state.hidden;

			this.setState({sidebarHidden})
		}
		catch(e){

		}
	}
	render(){

		return(
		<>
		<div id="main-content" className={this.cls +" "+ (this.state.sideBarHidden?"":"lg:pl-72")}>
			<TtsApp mainContent={this} onSocketLog={this.props.onSocketLog} onSocketConnect={this.props.onSocketConnect}/>
		</div>
		</>
		)
	}
}