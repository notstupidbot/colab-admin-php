import { useState , useEffect, useRef} from 'react'
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

  const createSocket = ()=>{
        const url = 'ws://localhost:7000';
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
            const uuid = socketUuid;

            socket.on("disconnect",()=>{
                console.log("socket disconnect");
                socket.emit("logout", uuid);

                setSocketConnected(false);

            });

            socket.on("log", (message)=>{
              console.log(`server log with message ${message}`)
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
{/* Navigation Toggle */}
<button type="button" className="text-gray-500 hover:text-gray-600" data-hs-overlay="#docs-sidebar" aria-controls="docs-sidebar" aria-label="Toggle navigation">
  <span className="sr-only">Toggle Navigation</span>
  <svg className="w-5 h-5" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
  </svg>
</button>
{/* End Navigation Toggle */}

<SideBar/>
<MainContent/>
</>
  )
}

export default App
