const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require('express');
const cors = require('cors');
const fs = require("fs");
// const sys = require("sys");
const path = require("path");
const app = express();
const httpServer = createServer(app);
const SocketRoute = require("./socket-routes");
const JobRoute = require("./job-routes");
const ProxyRoute = require("./proxy-routes");

const SOCKET_SERVER = new Server(httpServer, {cors: {origin: "*"}});
const port = 7000;
// app.use(express.json())
let proxy_mode = process.argv.includes('--proxy');
app.use(express.urlencoded({extended: true}));
const socketManager = SocketRoute(SOCKET_SERVER);

JobRoute(socketManager, app);

if(proxy_mode){
  ProxyRoute(socketManager,app);
}
async function main(){
  httpServer.listen(port, () => console.log('App is listening on url http://localhost:' + port));
}

main();