import {createServer, ServerResponse, IncomingMessage} from "http";
import {Logger} from "../utils/logger";
import * as events from "events";
import {GetHandler} from "./getHandler";
import {PostHandler} from "./postHandler";

export class HttpServer extends events.EventEmitter {
  private server;
  private logger;

  constructor(port: number) {
    super();
    this.logger = Logger.getInstance();

    this.server = createServer(this.requestHandler).listen(port);
  }

  private requestHandler(req: IncomingMessage, res: ServerResponse) {
    let requestHandlerLogger = Logger.getInstance();
    switch (req.method) {
      case "GET":
        GetHandler.handle(req, res);
        break;
      case "POST":
        PostHandler.handle(req, res);
        break;
      default:
        requestHandlerLogger.error(`request method not known! method: [ ${ req.method } ]`, this);
        break;
    }
  }

}
