import {Logger, LogType} from "./utils/logger";
import {HttpServer} from "./httpServer";


let logger = Logger.setInstance(LogType.debug);
let port = 4000;
let host = "http://localhost:3000/user1/";

let server = new HttpServer(port);

logger.info(`Server Started on port ${ port }: http://localhost:${port}`, "main.js" )

/*
let server = createServer((req: IncomingMessage, res: ServerResponse) => {
  logger.debug((req.method != undefined)? req.method : "no method", "root");
  if(req.method == "GET") {
    res.write("Done\n");
    res.end();
  }
}).listen(4000);

server.on("connect", (req: IncomingMessage, socket: stream.Duplex, head: Buffer) => {
  logger.debug((req.method != undefined)? req.method : "no method", "root");
  if(req.method == "GET") {
    socket.write("Done");
    socket.end();
  }
});

server.on("connection", socket => {
  socket.on("", data => {

  });
});
*/
