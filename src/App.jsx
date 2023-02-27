import { useState , useEffect} from 'react'
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

const socketUuid = uuidv4();

function App() {
  const [count, setCount] = useState(0)
  const {socketConnected,setSocketConnected} = useSharedSocketState();
  const {socketClient,setSocketClient} = useSharedSocketClient();
  let socketReconnecting = false;  
  let socket = null;

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

            socket.on("disconnect",()=>{
                console.log("socket disconnect");
                socket.emit("logout", {id : socket.id, uuid : socketUuid});

                setSocketConnected(false);
                // socketClient.changeUrl(url);
                reconnectSocket();

            });

            socket.on("log", (message)=>{

            });

            socket.emit("login", {id : socket.id, uuid : socketUuid});
        });

        setSocketClient(socket);
    }
    
    const reconnectSocket = ()=>{
        setTimeout(()=>{
            console.log("reconnecting in 5 second");
            initSocket();
        },5000);
    }
    const initSocket = ()=>{
        // console.log(socketClient);
        
        let socketMustBeCreated = false;

        if(!socketClient){
            socketMustBeCreated = true;
        }
        else if(typeof socketClient == "object"){
            setSocketConnected(socketClient.connected);

            if(!socketClient.connected){
                socketMustBeCreated = true;
            }
        }
        if(socketMustBeCreated){
            if(socketReconnecting){
                console.log("skip initSoket: caused reconnecting");
                return;
            }
            
            createSocket();
        }

    }
    useEffect(() => {
        initSocket();
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
