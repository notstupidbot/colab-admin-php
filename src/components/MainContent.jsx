import AppGrid from "./grid/AppGrid"
import SocketTesterChat from "./tester/SocketTesterChat"
export default function MainContent(){
	return(
<>
<div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:pl-72">
	<SocketTesterChat/>
</div>
</>
)
}