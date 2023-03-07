'use strict';

const path = require('path');

['debug', 'log', 'warn', 'error'].forEach((methodName) => {
    const originalLoggingMethod = console[methodName];
    console[methodName] = (firstArgument, ...otherArguments) => {
        const originalPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const callee = new Error().stack[1];
        Error.prepareStackTrace = originalPrepareStackTrace;
        const relativeFileName = path.relative(process.cwd(), callee.getFileName());
        const prefix = `${relativeFileName}:${callee.getLineNumber()}:`;
        if (typeof firstArgument === 'string') {
            originalLoggingMethod(prefix + ' ' + firstArgument, ...otherArguments);
        } else {
            originalLoggingMethod(prefix, firstArgument, ...otherArguments);
        }
    };
});
const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require('express');
const cors = require('cors');
const fs = require("fs");
// const sys = require("sys");
// const path = require("path");
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
app.use(cors());
const socketManager = SocketRoute(SOCKET_SERVER);

JobRoute(socketManager, app);

if(proxy_mode){
  ProxyRoute(socketManager,app);
}
async function main(){
  httpServer.listen(port, () => console.log('App is listening on url http://localhost:' + port));
}

main();