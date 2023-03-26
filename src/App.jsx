import React,{ useState , useEffect, useRef} from 'react'
import SideBar from "./components/SideBar"
import MainContent from "./components/MainContent"
import { HashRouter as Router, Routes, Route } from 'react-router-dom';


let dontRunTwice = true

import Ws from "./components/lib/Ws"
import AppConfig from "./components/lib/AppConfig"

const ws = Ws.getInstance();
const config = AppConfig.getInstance();
import "./App.css"
import "bootstrap-icons/font/bootstrap-icons.css"

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
            setHideSidebar(localStorage.hideSidebar == 'true')

            dontRunTwice=false
        }
    }, []);
    useEffect(()=>{
        localStorage.hideSidebar = hideSidebar
    },[hideSidebar])

  return (<>
    
     <MainContent config={config} 
                  socketConnected={socketConnected}
                  ws={ws}
                  hideSidebar={hideSidebar} setHideSidebar={setHideSidebar}/>
    
     </>)
}

export default App
