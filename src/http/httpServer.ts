import {createServer, ServerResponse, IncomingMessage} from "http";
import {Logger} from "../utils/logger";
import * as events from "events";
import {GetHandler} from "./getHandler";
import {PostHandler} from "./postHandler";

export class HttpServer extends events.EventEmitter {
  private static instance: HttpServer | null;
  public readonly server;
  private readonly logger;

  constructor(port: number) {
    super();
    this.logger = Logger.getInstance();

    this.server = createServer(this.requestHandler).listen(port);
  }

  static setInstance(port: number) {
    if (this.instance == null) {
      this.instance = new HttpServer(port);
    }
    return this.instance;
  }

  static getInstance() {
    if (this.instance == null) {
      throw new ReferenceError("HttpServer was not yet instantiated");
    }
    return this.instance;
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
