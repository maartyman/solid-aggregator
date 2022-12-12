"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketHandler = void 0;
const httpServer_1 = require("./httpServer");
const websocket_1 = require("websocket");
const aggregatorKeeper_1 = require("../aggregator/aggregatorKeeper");
const loggerSettings_1 = require("../utils/loggerSettings");
const tslog_1 = require("tslog");
class WebSocketHandler {
    constructor() {
        this.wsServer = new websocket_1.server({
            httpServer: httpServer_1.HttpServer.getInstance().server,
            autoAcceptConnections: false
        });
        this.wsServer.on('request', function (request) {
            /*
            //TODO do not auto accept make a origin allowed function
            if (!originIsAllowed(request.origin)) {
              // Make sure we only accept requests from an allowed origin
              request.reject();
              console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
              return;
            }
             */
            var connection = request.accept('bindings', request.origin);
            new tslog_1.Logger(loggerSettings_1.loggerSettings).debug("Connection accepted.");
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    new tslog_1.Logger(loggerSettings_1.loggerSettings).debug('Received Message: ' + message.utf8Data);
                    let aggregator = aggregatorKeeper_1.AggregatorKeeper.getInstance().getAggregator(message.utf8Data);
                    aggregator.on("binding", (bindings) => {
                        //TODO handle delete not only additions
                        connection.sendUTF(JSON.stringify({ bindings: bindings }));
                    });
                    let bindings = aggregator.getData();
                    if (bindings.length > 0) {
                        connection.sendUTF(JSON.stringify({ bindings: bindings }));
                    }
                    if (aggregator.isQueryFinished()) {
                        connection.close(1000, "Query finished.");
                    }
                    else {
                        aggregator.on("queryEvent", (message) => {
                            if (message === "done" && aggregatorKeeper_1.AggregatorKeeper.getInstance().guardingConfig.guardingType === "none") {
                                connection.close(1000, "Query finished.");
                            }
                        });
                    }
                }
            });
            connection.on('close', function (reasonCode, description) {
                new tslog_1.Logger(loggerSettings_1.loggerSettings).debug(' Peer ' + connection.remoteAddress + ' disconnected.');
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
exports.WebSocketHandler = WebSocketHandler;
WebSocketHandler.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
