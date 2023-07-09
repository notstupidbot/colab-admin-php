import zmq from 'zeromq'
import WampServer from 'wamp-server'
import autobahn from 'autobahn'
import Debug from 'debug'
// const WebSocketServer = Server.WebSocketServer
// Publisher


const publisher = zmq.socket('pub');
const address = 'tcp://127.0.0.1:5555';
publisher.bindSync(address);
console.log(`Publisher bound to ${address}`);
// setTimeout(() => {
// // setInterval(() => {
//   const message = 'Hello, subscribers!';
//   publisher.send(['topic', message]);
// }, 1000);

// Subscriber
const subscriber = zmq.socket('sub');
subscriber.connect(address);
subscriber.subscribe('topic');
console.log(`Subscriber connected to ${address}`);

subscriber.on('message', (topic, message) => {
  console.log(`Received message: ${message.toString()}`);
});


const realm = 'tts.realm'
const SERVER = new WampServer({
  port: 7001,
  realms: [realm], // array or string
});

//zmqTts_0f05ebbd12ac4dd3b4b44fd4a4fdad08

// const manager = autobahn
class ABSessionManager {
  connection = null
  endPoint = 'ws://localhost:7001/ws'
  realm = 'tts.realm'
  retryHandlerSet = false
  reconnectInterval = 5000
  reconnect(){
    this.retryHandlerSet = true
		setTimeout(()=>{
 			this.init();
			this.retryHandlerSet = false
		},this.reconnectInterval)
  }
  startSubcription(session){
    session.subscribe('register', (a,b,c) => {
      console.log('-----------------------')
      console.log(a,b,c)
      console.log('--------------------')
    })
  }
  init(){
    if(this.connection){
      return
    }
    
    this.connection = new autobahn.Connection({
      realm: this.realm,
      url: this.endPoint 
    })

    this.connection.onopen = (session, details) => {
			console.log('Connected to the server!')
			// this.onSocketConnectHandler()
			// this.setSoketConnected(true)
			
      this.startSubcription(session)
		}
		  
		this.connection.onclose = (reason, details) => {
			console.log('Connection closed:', reason)
			this.onSocketDisconnectHandler()
      this.setSoketConnected(false)
			
      // Attempt reconnection
			if(!this.retryHandlerSet)
				this.reconnect()
		  }  
		  
      this.connection.open() 
  }
}

const aBSessionManager = new ABSessionManager()
aBSessionManager.init()