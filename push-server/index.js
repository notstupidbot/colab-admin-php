const { Server } = require("socket.io");
const { createServer } = require("http");
const express = require('express');
const cors = require('cors');
const fs = require("fs");
const path = require("path");
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
cors: {
    origin: "*"
},
});
const port = 7000;
io.on("connection", async(s) => {
    console.log("We are live and connected");
    s.on("chat",(a,b)=>{
      // console.log(a,b)
      s.emit("chat","hello iam replyng")
    })
    io.emit("chat", "Hi welcome to chat server can i help you");
});

async function main(){
    httpServer.listen(port, () => console.log('App is listening on url http://localhost:' + port));
}

main();