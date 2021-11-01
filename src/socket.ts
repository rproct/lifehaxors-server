import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";
const path = require('path')
console.log(path.extname(__filename))

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    pingTimeout: 300000
  });

  useSocketServer(io, { controllers: [__dirname + "/api/controllers/*" + path.extname(__filename) ] });

  return io;
};
