import {Logger, LogType} from "./utils/logger";
import {HttpServer} from "./http/httpServer";
import {AggregatorKeeper} from "./aggregator/aggregatorKeeper";
import {WebSocketHandler} from "./http/webSocketHandler";


let logger = Logger.setInstance(LogType.debug);
let port = 4000;

let server = HttpServer.setInstance(port);
let aggregatorKeeper = AggregatorKeeper.setInstance();
let webSocketHandler = WebSocketHandler.setInstance();

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
