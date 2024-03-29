import { v4 } from 'uuid';
import Helper from "./Helper"
/**
 * Ws
 * 
 * Autobahn client wrapper for ZMQ Messaging protocol communication
 * */
class Ws{
	endpoint = null
	socketUid = null
	subscriberId = null
	reconnectInterval = 5000
	connection = null
	handler = null
	inited = false
	
	setSoketConnected = (isConnected) => {}
	setSoketLog = (message, data) => {}
	setSoketLog_context = {}
	static instance = null
	/**
	 * get singelton instance
	 * @return {Ws}
	 * */
	static getInstance(){
		if(Ws.instance instanceof Ws){
		}else{
			Ws.instance = Ws.factory();

		}	

		return Ws.instance;
	}
	/**
	 * create singelton instance
	 * @return {Ws}
	 * */
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
		console.log(`Ws.constructor()`)
	}
	/**
	 * reset onSocketLog Handler
	 * */
	resetSocketLogHandler(){
		this.setSoketLog = (message, data) => {}
	}
	/**
	 * set default socketId string
	 * */
	setDefaultSocketId(){
		this.socketUid = localStorage.socketUid || v4();
	}
	/**
	 * set default socket SubscriberId
	 * */
	setDefaultSubcriberId(){
		const subscriberId = 'zmqTts_' + this.socketUid.replace(/\W/g,'');
		this.subscriberId = localStorage.subscriberId || subscriberId;
	}
	/**
	 * get socket subcriberId
	 * */
	getSubcriberId(){
		return this.subscriberId;
	}
	/**
	 * reconnect socket connection
	 * */
	async reconnect(){
        console.log(`Ws: retry in ${this.reconnectInterval} ms`);
		this.retryHandlerSet = true
		setTimeout(()=>{
 			this.init();
			 this.retryHandlerSet = false
		},this.reconnectInterval)
        // await Helper.timeout(this.reconnectInterval);
       
    }
    /**
	 * set event handler on socket event
	 * @example
	 * 
	 * Ws.setHandler('connect', (e)=>e, 'unique_key')
	 * */
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
    setSocketLogHandlerState(setSoketLog, contextObj){
    	this.setSoketLog = setSoketLog;
    	this.setSoketLog_context = contextObj;
    }
    alreadyInit(){
    	return this.inited
    }
	startSubcription(session){
		session.subscribe(this.subscriberId,(a, payload,t)=>{

			console.log(payload)
			switch(payload.type){

				case 'log' :
					const message = payload.message;
					const data = payload.result;
					this.onSocketLogHandler(message, data);
					this.setSoketLog(message, data, this);

				break
			}
		});
	}
	retryHandlerSet = false
	init(){
		if(this.connection){
			return
		}
		const realm = 'tts.realm'
		this.connection = new autobahn.Connection({
			realm ,// Specify the realm for the WAMP server
			url: this.endpoint, // WebSocket URL
		  //   authmethods: ['anonymous'], // Authentication methods (optional)
		  //   authid: 'my_auth_id', // Authentication ID (optional)
		  });
		
		// Reconnection handlers
		this.connection.onopen = (session, details) => {
			console.log('Connected to the server!');
			this.onSocketConnectHandler();
			this.setSoketConnected(true);
			this.startSubcription(session)

			session.publish('register', [],{ subscriber_id : this.subscriberId })
		  };
		  
		this.connection.onclose = (reason, details) => {
			console.log('Connection closed:', reason);
			this.onSocketDisconnectHandler();
            this.setSoketConnected(false);
			// Attempt reconnection
			if(!this.retryHandlerSet)
				this.reconnect();

		  };  
		this.connection.open()  
	}
	init_legacy(){
		this.inited = true
		console.log(`Ws.init() ${this.subscriberId}`)
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
                        this.setSoketLog(message, data, this);

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
            skipSubprotocolCheck: true,
			realm : 'com.example.inge'
        });
	}
	/**
	 * set socket endpoint to connect*/
	setEndpoint(endpoint){
		this.endpoint = endpoint;
	}
}

export default Ws