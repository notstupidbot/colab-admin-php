import { v4 } from 'uuid';
import Helper from "./Helper"

export default class Ws{
	endpoint = null
	socketUid = null
	subscriberId = null
	reconnectInterval = 5000
	connection = null
	handler = null
	
	setSoketConnected = (isConnected) => {}
	setSoketLog = (message, data) => {}

	static instance = null

	static getInstance(){
		if(Ws.instance instanceof Ws){
		}else{
			Ws.instance = Ws.factory();

		}	

		return Ws.instance;
	}
	static factory(){
		const instance = new Ws()
		return instance
	}
	constructor(){
		this.setDefaultSocketId();
		this.setDefaultSubcriberId();

		this.handler = {
			connect : {},
			log : {},
			disconnect : {},
		}
	}

	resetSocketLogHandler(){
		this.setSoketLog = (message, data) => {}
	}
	setDefaultSocketId(){
		this.socketUid = localStorage.socketUid || v4();
	}

	setDefaultSubcriberId(){
		const subscriberId = 'zmqTts_' + this.socketUid.replace(/\W/g,'');
		this.subscriberId = localStorage.subscriberId || subscriberId;
	}

	async reconnect(){
        console.log(`Ws: retry in ${this.reconnectInterval} ms`);
        await Helper.timeout(this.reconnectInterval);
        this.init();
    }
    setHandler(evt, callback, key){
    	const handlerKey = `${key}_on_${evt}`;
    	if(typeof this.handler[evt][handlerKey] != 'function'){
    		this.handler[evt][handlerKey] = callback;
    	}
    }
    onSocketConnectHandler(){
    	const handlerObj = this.handler.connect;
    	Object.keys(handlerObj).map(key=>handlerObj[key](this.connection))
    }
    onSocketLogHandler(message, data){
    	const handlerObj = this.handler.log;
    	Object.keys(handlerObj).map(key=>handlerObj[key](message, data))
    }
    onSocketDisconnectHandler(){
    	const handlerObj = this.handler.disconnect;
    	Object.keys(handlerObj).map(key=>handlerObj[key](this.connection))
    }
    setSocketConnectedHandlerState(setSoketConnected){
    	this.setSoketConnected = setSoketConnected;
    }
    setSocketLogHandlerState(setSoketLog){
    	this.setSoketLog = setSoketLog;
    }
	init(){

        this.connection = new ab.Session(this.endpoint,()=>{
        /*SOCKET OPEN*/    
            this.connection.subscribe(this.subscriberId,(subscriber_id, res)=>{
                switch(res.type){
                    case 'loged_in':
                        this.onSocketConnectHandler();
                        this.setSoketConnected(true);
                    break;

                    case 'log' :
                        const message = res.message;
                        const data = res.data;
                        this.onSocketLogHandler(message, data);
                        this.setSoketLog(message, data);

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
            this.onSocketDisconnectHandler();
            this.setSoketConnected(false);

            this.reconnect();
        },{
            skipSubprotocolCheck: true
        });
	}
	setEndpoint(endpoint){
		this.endpoint = endpoint;
	}
}