import {HttpServer} from "./httpServer";
import {Message, server, connection} from "websocket";
import {AggregatorKeeper} from "../aggregator/aggregatorKeeper";
import {Bindings} from "@comunica/bindings-factory";
import {loggerSettings} from "../utils/loggerSettings";
import {Logger} from "tslog";

export class WebSocketHandler {
  private readonly logger = new Logger(loggerSettings);
  private static instance: WebSocketHandler | null;
  private wsServer;

  constructor() {
    this.wsServer = new server({
      httpServer: HttpServer.getInstance().server,
      autoAcceptConnections: false
    });

    this.wsServer.on('request', function(request) {
      /*
      //TODO do not auto accept make a origin allowed function
      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
      }
       */

      var connection: connection = request.accept('bindings', request.origin);

      new Logger(loggerSettings).debug("Connection accepted.");
      connection.on('message', function(message: Message) {
        if (message.type === 'utf8') {
          new Logger(loggerSettings).debug('Received Message: ' + message.utf8Data);
          let aggregator = AggregatorKeeper.getInstance().getAggregator(message.utf8Data);

          aggregator.on("binding", (bindings: Bindings[]) => {
            //TODO handle delete not only additions
            connection.sendUTF(JSON.stringify({bindings: bindings}));
          });

          let bindings = aggregator.getData();
          if (bindings.length > 0){
            connection.sendUTF(JSON.stringify({bindings: bindings}));
          }

          if (aggregator.isQueryFinished()) {
            connection.close(1000, "Query finished.");
          }
          else {
            aggregator.on("queryEvent", (message: string) => {
              if (message === "error") {
                connection.close(1011, "Internal error");
              }
            });
          }
        }
      });
      connection.on('close', function(reasonCode, description) {
        new Logger(loggerSettings).debug(' Peer ' + connection.remoteAddress + ' disconnected.');
      });
    });
  }

  static setInstance() {
    if (this.instance == null) {
      this.instance = new WebSocketHandler();
    }
    return this.instance;
  }

  static getInstance() {
    if (this.instance == null) {
      throw new ReferenceError("HttpServer was not yet instantiated");
    }
    return this.instance;
  }

}
