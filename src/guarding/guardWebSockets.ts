import {Guard} from "./guard";
import {Aggregator} from "../aggregator/aggregator";
import {connection, Message} from "websocket";
import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";


export class GuardWebSockets implements Guard {
  private readonly logger = new Logger(loggerSettings);
  private readonly ws;
  private connection?: connection;
  private notifiers = new Map<string, Aggregator[]>();
  private pubRegEx = new RegExp(/pub (https?:\/\/\S+)/);

  constructor(host: string) {
    const WebSocketClient = require('websocket').client;
    this.ws = new WebSocketClient();

    this.ws.on('connect', (connection: connection) => {
      this.logger.debug("ws connected to pod");
      this.connection = connection;
      connection.on('error', (error) => {
        throw new Error("Guarding web socket failed: " + error.toString());
      });
      connection.on('close', () => {
        throw new Error("Guarding web socket closed");
      });
      connection.on('message', (message: Message) => {
        if (message.type === 'utf8') {
          const resources = this.pubRegEx.exec(message.utf8Data);
          this.logger.debug("resources: " + resources);
          if (resources && resources[1]) {
            const aggregators = this.notifiers.get(resources[1].toString())
            if (aggregators) {
              for (const aggregator of aggregators) {
                this.logger.debug("data has changed for: " + aggregator);
                aggregator.dataChanged(resources[1].toString());
              }
            }
          }
        }
      });
    });

    this.ws.connect("ws://" + host, 'solid-0.1');
  }

  evaluateResource(resource: string, aggregator: Aggregator): void {
    this.logger.debug("evaluateResource: " + resource);
    if (this.connection) {
      this.connection.sendUTF('sub ' + resource);
      let aggregators = this.notifiers.get(resource);
      if (aggregators === undefined) {
        this.notifiers.set(resource, [aggregator]);
      }
      else {
        aggregators.push(aggregator);
      }
      this.logger.debug("aggregators: " + aggregators);
    }
    else {
      this.ws.on('connect', (connection: connection) => {
        connection.sendUTF('sub ' + resource);
        let aggregators = this.notifiers.get(resource);
        if (aggregators === undefined) {
          this.notifiers.set(resource, [aggregator]);
        }
        else {
          aggregators.push(aggregator);
        }
        this.logger.debug("aggregators: " + aggregators);
      });
    }
  }
}
