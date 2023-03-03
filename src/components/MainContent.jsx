import AppGrid from "./grid/AppGrid"
import SocketTesterChat from "./tester/SocketTesterChat"
import TtsApp from "./apps/TtsApp"
export default function MainContent({onSocketConnect,onSocketLog}){
	return(
<>
<div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:pl-72">
	<TtsApp onSocketLog={onSocketLog} onSocketConnect={onSocketConnect}/>
</div>
</>
)
}