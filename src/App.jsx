import React,{ useState , useEffect, useRef, createRef} from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import SideBar from "./components/SideBar"
import MainContent from "./components/MainContent"
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

import { useBetween } from "use-between";
import useSocketClient from "./shared/useSocketClient";
import useSocketState from "./shared/useSocketState";
// import useServerCfgState from "./shared/useServerCfgState";
import app_config from "./app.config"
// const useSharedServerCfgState = () => useBetween(useServerCfgState);
const useSharedSocketState = () => useBetween(useSocketState);
const useSharedSocketClient = () => useBetween(useSocketClient)

let socketUuid = localStorage.socketUuid || uuidv4();
let messagingSubscriberId = 'zmqTts_' + socketUuid.replace(/\W/g,'');

console.log(messagingSubscriberId)
localStorage.socketUuid = socketUuid;
localStorage.messagingSubscriberId = messagingSubscriberId;

let dontRunTwice = true


function App() {
  const [count, setCount] = useState(0)
  const {socketConnected,setSocketConnected} = useSharedSocketState();
  const {socketClient,setSocketClient} = useSharedSocketClient();

  let socket = null;

  const socketClientRef = useRef();
  socketClientRef.current = socketClient;

  const socketConnectedRef = useRef();
  socketConnectedRef.current = socketConnected;

  const socketConnectHandlerList = [];
  const socketLogHandlerList = [];
  const socketDisconnectHandlerList = [];

  const sideBarRef = useRef(null);
  const mainContentRef = useRef(null);

  let Ws_conn, Ws_autoReconnectInterval = 5000;

  const onSocketLogHandler=(message, data)=>{
    socketLogHandlerList.map(callback=>callback(message,data))
  }
  const onSocketConnectHandler=(socket)=>{
    socketConnectHandlerList.map(callback=>callback(socket))
  }
  const onSocketDisconnectHandler=(socket)=>{
    socketDisconnectHandlerList.map(callback=>callback(socket))
  }
  const onSocketLog=(callback)=>{
    socketLogHandlerList.push(callback);
  }
  const onSocketConnect=(callback)=>{
    socketConnectHandlerList.push(callback);
  }
 
  
    const Ws_reconnect = () => {
        console.log(`Ws: retry in ${Ws_autoReconnectInterval} ms`);
        setTimeout(()=>{
            console.log("Ws: reconnecting...");
            Ws_init();
        },Ws_autoReconnectInterval);
    } 
    const Ws_init = () => {
        const wampEndpoint = app_config.getZmqEndpoint();
        Ws_conn = new ab.Session(wampEndpoint,()=>{
        /*SOCKET OPEN*/    
            Ws_conn.subscribe(messagingSubscriberId,(subscriber_id, res)=>{
                switch(res.type){
                    case 'loged_in':
                        setSocketConnected(true);
                    break;

                    case 'log' :
                        const message = res.message;
                        const data = res.data;
                        onSocketLogHandler(message, data);
                        console.log(`Ws.log with message ${message} and data:`)
                        console.log(data);
                    break;
                    /*
                    case 'job' :
                        const job = res.job;
                        const message = res.message;

                        console.log(`Ws.log with message ${message} and data:`)
                        console.log(data);
                    break;    
                    */
                }
            });
        },()=>{
        /*SOCKET CLOSE*/    
            console.log('Ws is closed');
            setSocketConnected(false);
            onSocketDisconnectHandler(Ws_conn);
            Ws_reconnect();
        },{
            skipSubprotocolCheck: true
        });
    }
    useEffect(() => {
        if(dontRunTwice){
            Ws_init();
            dontRunTwice=false
        }
            

    }, []);

  
  return (
<>


<SideBar ref={sideBarRef} mainContent={mainContentRef}/>
<MainContent sideBar={sideBarRef} ref={mainContentRef} onSocketLog={onSocketLog} onSocketConnect={onSocketConnect}/>
</>
  )
}

export default App
