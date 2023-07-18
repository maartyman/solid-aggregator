import {createServer, ServerResponse, IncomingMessage} from "http";
import * as events from "events";
import {GetHandler} from "./getHandler";
import {PostHandler} from "./postHandler";
import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";

export class HttpServer extends events.EventEmitter {
  private readonly logger = new Logger(loggerSettings);
  private static instance: HttpServer | null;
  public readonly server;

  constructor(port: number) {
    super();
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
    let requestHandlerLogger = new Logger(loggerSettings);
    res.setHeader("Access-Control-Allow-Origin", "*");
    switch (req.method) {
      case "GET":
        GetHandler.handle(req, res);
        break;
      case "POST":
        PostHandler.handle(req, res);
        break;
      case "OPTIONS":
        res.statusCode = 200;
        res.end();
        break;
      default:
        requestHandlerLogger.error(`request method not known! method: [ ${ req.method } ]`);
        res.statusCode = 500;
        res.end();
        break;
    }
  }
}
