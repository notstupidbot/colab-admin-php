const http = require("http");
const socketio = require("socket.io");

const httpServer = http.createServer();
const io = new socketio.Server(httpServer, {
  // options
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(3000);