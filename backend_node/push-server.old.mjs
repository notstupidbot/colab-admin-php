import zmq from 'zeromq'
import Server from './wamp-server/dist/index.js'
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

// Create a new WAMP server instance
const connection = new autobahn.Connection({
  realm: 'com.example.inge', // Specify the realm for the WAMP server
  url: 'ws://localhost:7001/ws', // WebSocket URL
  reconnect:true
//   authmethods: ['anonymous'], // Authentication methods (optional)
//   authid: 'my_auth_id', // Authentication ID (optional)
});

// Define a procedure to be called remotely
function addNumbers(args, kwargs, details) {
  const { a, b } = args[0];
  const result = a + b;

  // Publish the result
  connection.session.publish(details.topic + '.result', [], { result });

  return result;
}



let DEBUG='wamp:*'


const SERVER = new Server({
  port: 7001,
  realms: ['com.example.inge'], // array or string
});
// to close the server - SERVER.close();
console.log(SERVER.wss)
connection.onopen = function (session) {

    function onevent(args) {}
    function addThree(args) {
      return args[0] + args[1] + args[2];
    }
  
    session.register('com.myapp.addThree', addThree)
    session.subscribe('com.myapp.event', onevent);
  
  };
  
  connection.onclose = function(e) {
    console.error(e)
  }
  
  connection.open();