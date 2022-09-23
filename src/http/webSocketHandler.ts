import {HttpServer} from "./httpServer";
import {Message, server, connection} from "websocket";
import {QueryExecutorFactory} from "../queryExecutor/queryExecutorFactory";
import {Bindings} from "@comunica/bindings-factory";
import {loggerSettings} from "../utils/loggerSettings";
import {Logger} from "tslog";
import {QueryExecutor} from "../queryExecutor/queryExecutor";

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
          let queryExecutor = QueryExecutor.factory.get(message.utf8Data);

          if (!queryExecutor) {
            connection.close(1006, "Query UUID doesn't exist.");
            return;
          }

          queryExecutor.on("binding", (bindings: Bindings[], newBinding: boolean) => {
            if (newBinding) {
              connection.sendUTF("added " + JSON.stringify({bindings: bindings}));
            }
            else {
              connection.sendUTF("removed " + JSON.stringify({bindings: bindings}));
            }
          });

          let bindings = queryExecutor.getData();
          if (bindings.length > 0){
            connection.sendUTF("added " + JSON.stringify({bindings: bindings}));
          }

          /*
          if (queryExecutor.isQueryFinished()) {
            connection.close(1000, "Query finished.");
          }
          else {
            queryExecutor.on("queryEvent", (message: string) => {
              if (message === "error") {
                connection.close(1011, "Internal error");
              }
            });
          }
           */
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
