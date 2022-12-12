"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardWebSockets = void 0;
const tslog_1 = require("tslog");
const loggerSettings_1 = require("../utils/loggerSettings");
class GuardWebSockets {
    constructor(host) {
        this.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        this.notifiers = new Map();
        this.pubRegEx = new RegExp(/pub (https?:\/\/\S+)/);
        const WebSocketClient = require('websocket').client;
        this.ws = new WebSocketClient();
        this.ws.on('connect', (connection) => {
            this.logger.debug("ws connected to pod");
            this.connection = connection;
            connection.on('error', (error) => {
                throw new Error("Guarding web socket failed: " + error.toString());
            });
            connection.on('close', () => {
                throw new Error("Guarding web socket closed");
            });
            connection.on('message', (message) => {
                if (message.type === 'utf8') {
                    const resources = this.pubRegEx.exec(message.utf8Data);
                    if (resources && resources[1]) {
                        const aggregators = this.notifiers.get(resources[1].toString());
                        if (aggregators) {
                            this.logger.debug("data has changed in resource: " + resources[1].toString());
                            for (const aggregator of aggregators) {
                                aggregator.dataChanged(resources[1].toString());
                            }
                        }
                    }
                }
            });
        });
        this.ws.connect("ws://" + host, 'solid-0.1');
    }
    evaluateResource(resource, aggregator) {
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
            this.ws.on('connect', (connection) => {
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
exports.GuardWebSockets = GuardWebSockets;
