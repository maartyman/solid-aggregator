import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";
import {Aggregator} from "../aggregator/aggregator";
import {GuardWebSockets} from "./guardWebSockets";
import {GuardPolling} from "./guardPolling";
import {Guard} from "./guard";
import {connection, Message} from "websocket";

/*
    Do something like: on new link => new guard (via guardKeeper)
    in guardkeeper: check if a websocket to this server is open
    if yes: add new subscription to this websocket to the new resource
    if no: add new websocket to the new server and add subscription to resource
    if a websocket isn't available:
      download resource and poll it from time to time and check for difference

    guardKeeper:
      //makes the guards => determines if the server can handle websockets

    guard (interface):
      //interface for the 2 guards

    guardPolling:
      //downloads the resource from time to time and checks if it has changed

    guardWebSockets:
      //uses websockets to check if a resource has changed

    */

export class GuardKeeper {
  private readonly logger = new Logger(loggerSettings);
  private static instance?: GuardKeeper;
  private guards: Map<string, Guard>;

  constructor() {
    this.guards = new Map<string, Guard>();
  }

  static setInstance() {
    if (this.instance == null) {
      this.instance = new GuardKeeper();
    }
    return this.instance;
  }

  static getInstance() {
    if (this.instance == null) {
      this.instance = new GuardKeeper();
      new Logger(loggerSettings).error("AggregatorKeeper was not instantiated, instantiating it now with default values.", this);
    }
    return this.instance;
  }

  public async addGuard(resource: string, aggregator: Aggregator) {
    const url = new URL(resource);

    let guard = this.guards.get(url.host);

    if (!guard) {
      if (await this.checkWebSocketAvailability(url.host)) {
        guard = new GuardWebSockets(url.host);
      } else {
        guard =new GuardPolling();
      }
      this.guards.set(url.host, guard);
    }

    guard.evaluateResource(resource, aggregator);
  }

  private async checkWebSocketAvailability(host: string): Promise<boolean> {
    //TODO is this the best solution?
    this.logger.debug("Checking pod availability");
    const WebSocketClient = require('websocket').client;
    const ws = new WebSocketClient();

    const promise = new Promise<boolean>( resolve => {
      ws.on('connect', (connection: connection) => {
        this.logger.debug("Checking pod availability: connection succeeded");
        ws.abort();
        resolve(true);
      });

      ws.on("connectFailed", () => {
        this.logger.debug("Checking pod availability: connection failed");
        ws.abort();
        resolve(false);
      });

      setTimeout(() => {
        ws.abort();
        resolve(false);
      }, 30000);
    });

    ws.connect("ws://" + host, 'solid-0.1');

    return promise;
  }
}
