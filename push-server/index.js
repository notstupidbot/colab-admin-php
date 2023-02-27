const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const app = express();
const httpServer = createServer(app);
const {m_socket} = require("./models");

const io = new Server(httpServer, {
cors: {
    origin: "*"
},
});
const port = 7000;
io.on("connection", async(s) => {
    // console.log("We are live and connected");
    s.on("chat",(message)=>{
      console.log(`${s.id} chat a ${message} `)
      s.emit("chat","you said " + message)
    });
    s.on("job",(job)=>{
      console.log(`${s.id} chat a ${job} `)
      s.emit("job","you said " + job)
    });

    s.on("login",(obj)=>{
      console.log(obj)
      console.log(s.conn.remoteAddress)
      m_socket.create(s.id,s.conn.remoteAddress,obj.uuid,1).then(r=>{
        console.log(r)
      });
      s.emit("log","loged in");
    });

    s.on("logout",(obj)=>{
      console.log(obj)
      s.emit("log","loged out");

      m_socket.setDisconnected(s.id);
    });

    io.emit("chat", "Hi welcome to chat server can i help you");
});

async function main(){
    httpServer.listen(port, () => console.log('App is listening on url http://localhost:' + port));
}

main();