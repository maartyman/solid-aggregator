import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";
import {GuardWebSockets} from "./guardWebSockets";
import {GuardPolling} from "./guardPolling";
import {Guard} from "./guard";
import {connection} from "websocket";
import {Resource} from "../resource/resource";

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

export class GuardFactory extends Factory<string, Guard> {
  private readonly logger = new Logger(loggerSettings);

  constructor() {
    super(Guard);
  }

  public getOrCreate(key: string, parent?: Resource | undefined, actor?: new (key: string) => Guard) {

    let temporaryPollingGuard = this.map.get(key);

    if (!temporaryPollingGuard) {
      temporaryPollingGuard = new GuardPolling(key);
      this.map.set(key, temporaryPollingGuard);
      this.changeGuardType(temporaryPollingGuard, typeof GuardWebSockets);
    }

    if (!parent) {
      throw new Error("Making guard, guard doesn't have a parent.");
    }

    temporaryPollingGuard.makeLink(parent, temporaryPollingGuard);

    return temporaryPollingGuard;
  }

  /*
  public async addGuard(resource: Resource): Promise<Guard> {
    const url = new URL(resource.resourceName);

    let guard = this.guards.get(resource.resourceName);

    if (!guard) {
      if (await this.checkWebSocketAvailability(url.host)) {
        guard = new GuardWebSockets(resource.resourceName);
      } else {
        guard =new GuardPolling();
      }
      this.guards.set(url.host, guard);
    }

    guard.evaluateResource(resourceName, aggregatorResource);
    return guard;
  }

   */

  public async changeGuardType(currentGuard: Guard, guardType: string) {
    if (typeof currentGuard === guardType) {
      return;
    }
    if (guardType === typeof GuardPolling) {
      const newGuard = new GuardPolling(currentGuard.key);
      //TODO if ready link it to the resource and delete the polling resource
    }
    else if (guardType === typeof GuardWebSockets) {
      const newGuard = new GuardWebSockets(currentGuard.key);
      //TODO if ready link it to the resource and delete the polling resource
    }
    else {
      this.logger.warn("Guardtype: " + guardType + " doesn't exist");
    }
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
