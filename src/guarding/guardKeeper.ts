import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";
import {GuardingConfig} from "../utils/guardingConfig";
import {Aggregator} from "../aggregator/aggregator";
import {GuardWebSockets} from "./guardWebSockets";
import {GuardPolling} from "./guardPolling";
import {Guard} from "./guard";

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

  public readonly guardingConfig: GuardingConfig;

  constructor(guardingConfig: GuardingConfig) {
    this.guardingConfig = guardingConfig;
    this.guards = new Map<string, Guard>();
  }

  static setInstance(guardingConfig: GuardingConfig) {
    if (this.instance == null) {
      this.instance = new GuardKeeper(guardingConfig);
    }
    return this.instance;
  }

  static getInstance() {
    if (this.instance == null) {
      this.instance = new GuardKeeper(GuardingConfig.default);
      new Logger(loggerSettings).error("AggregatorKeeper was not instantiated, instantiating it now with default values.", this);
    }
    return this.instance;
  }

  public addGuard(resource: string, aggregator: Aggregator) {
    const url = new URL(resource);

    let guard = this.guards.get(url.host);

    if (!guard) {
      if (this.checkWebSocketAvailability(url.host)) {
        guard = new GuardWebSockets(url.host);
      } else {
        guard =new GuardPolling(url.host);
      }
      this.guards.set(url.host, guard);
    }

    guard.evaluateResource(resource, aggregator);
  }

  private checkWebSocketAvailability(host: string): boolean {
    //TODO add ws check
    return true;
  }
}
