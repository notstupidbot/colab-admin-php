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
localStorage.socketUuid = socketUuid;
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
  const createSocket = ()=>{
        const url = `${app_config.getPushEndpoint()}`;
        if(!url){
            console.log("skip initSocket: url empty")
        }
        console.log(`initSocket ${url}`)
        socket = io(url,{
            reconnection: false,
            extraHeaders: {
                'ngrok-skip-browser-warning':1
            }
        });
        socket.on("connect",() => {
            setSocketConnected(true);
            onSocketConnectHandler(socket);

            const uuid = socketUuid;

            socket.on("disconnect",()=>{
                console.log("socket disconnect");
                onSocketDisconnectHandler(socket);

                socket.emit("logout", uuid);
                setSocketConnected(false);

            });

            socket.on("log", (message, data)=>{
                onSocketLogHandler(message, data)
               // console.log(`server log with message ${message}`)
            });
            socket.emit("login", uuid);

        });

        setSocketClient(socket);
    }
    
    const reconnectSocket = ()=>{
        setInterval(()=>{ 
            if(!socketConnectedRef.current){
              console.log("socketConnected is false");
              return createSocket();
            }
            if(!socketClientRef.current.connected){
              console.log("socketClient.connected is false");

              return createSocket();
            }
        },5000);
    }
    
    useEffect(() => {
        if(dontRunTwice){
            createSocket();
            reconnectSocket();
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
