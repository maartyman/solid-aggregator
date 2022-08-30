import {HttpServer} from "./httpServer";
import {Logger} from "../utils/logger";
import {Message, server, connection} from "websocket";
import {AggregatorKeeper} from "../aggregator/aggregatorKeeper";
import {Bindings} from "@comunica/bindings-factory";

export class WebSocketHandler {
  private static instance: WebSocketHandler | null;
  private wsServer;
  private logger;

  constructor() {
    this.logger = Logger.getInstance();
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
      Logger.getInstance().debug("Connection accepted.", "WebSocketHandler");
      connection.on('message', function(message: Message) {
        if (message.type === 'utf8') {
          Logger.getInstance().debug('Received Message: ' + message.utf8Data, "WebSocketHandler");
          let aggregator = AggregatorKeeper.getInstance().getAggregator(message.utf8Data);

          aggregator.on("binding", (binding: {bindings: Bindings[]}) => {
            //TODO handle delete not only additions
            connection.sendUTF(JSON.stringify(binding));
          });

          let data = aggregator.getData();
          if (data.bindings.length > 0){
            connection.sendUTF(JSON.stringify(data));
          }

          if (aggregator.isQueryFinished()) {
            connection.close(1000, "Query finished.");
          }
          else {
            aggregator.on("queryEvent", (message: string) => {
              if (message === "done" && AggregatorKeeper.getInstance().guardingConfig.guardingType === "none") {
                connection.close(1000, "Query finished.");
              }
            });
          }
        }
      });
      connection.on('close', function(reasonCode, description) {
        Logger.getInstance().debug(' Peer ' + connection.remoteAddress + ' disconnected.', "WebSocketHandler");
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
