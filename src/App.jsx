import React,{ useState , useEffect, useRef} from 'react'
import SideBar from "./components/SideBar"
import MainContent from "./components/MainContent"


let dontRunTwice = true

import Ws from "./components/app/Ws"
import AppConfig from "./components/app/AppConfig"

const ws = Ws.getInstance();
const config = AppConfig.getInstance();

function App() {

    const [socketConnected,setSocketConnected] = useState(false);
    const [hideSidebar,setHideSidebar] = useState(false);

    const socketConnectHandlerList = [];
    const socketLogHandlerList = [];
    const socketDisconnectHandlerList = [];


    
 
    
    ws.setEndpoint(config.getMessagingEndpoint());
    ws.setSocketConnectedHandlerState(setSocketConnected);
    config.getUiConfig().setHideSidebarState(setHideSidebar);
    /*
    const onSocketLogHandler=(message, data)=>{
        // console.log(`onSocketLogHandler arrived at App.jsx`);
        socketLogHandlerList.map(callback=>callback(message,data))
    }
    const onSocketConnectHandler=(socket)=>{
        // console.log(`onSocketConnectHandler arrived at App.jsx`);
        socketConnectHandlerList.map(callback=>callback(socket))
    }
    const onSocketDisconnectHandler=(socket)=>{
        // console.log(`onSocketDisconnectHandler arrived at App.jsx`);
        socketDisconnectHandlerList.map(callback=>callback(socket))
    }
    const onSocketLog=(callback)=>{
        socketLogHandlerList.push(callback);
    }
    const onSocketConnect=(callback)=>{
        socketConnectHandlerList.push(callback);
    }
    
    ws.setHandler('connect', onSocketConnectHandler, 'app');
    ws.setHandler('log', onSocketLogHandler, 'app');
    ws.setHandler('disconnect', onSocketDisconnectHandler, 'app');
    */
    useEffect(() => {
        if(dontRunTwice){
            ws.init();
            dontRunTwice=false
        }
    }, []);

  return (<>

     <SideBar config={config} hideSidebar={hideSidebar} setHideSidebar={setHideSidebar}/>
     <MainContent config={config} 
                  socketConnected={socketConnected}
                  ws={ws}
                  hideSidebar={hideSidebar}/>

    </>)
}

export default App
