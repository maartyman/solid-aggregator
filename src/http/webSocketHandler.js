"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketHandler = void 0;
const httpServer_1 = require("./httpServer");
const websocket_1 = require("websocket");
const loggerSettings_1 = require("../utils/loggerSettings");
const tslog_1 = require("tslog");
const queryExecutor_1 = require("../queryExecutorPackage/queryExecutor/queryExecutor");
class WebSocketHandler {
    constructor() {
        this.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        this.protocolVersion = "1.0";
        this.generalProtocol = "solid-aggregator-" + this.protocolVersion;
        this.bindingProtocol = this.generalProtocol + "#bindings";
        this.readyProtocol = this.generalProtocol + "#ready";
        this.wsServer = new websocket_1.server({
            httpServer: httpServer_1.HttpServer.getInstance().server,
            autoAcceptConnections: false
        });
        this.wsServer.on('request', (request) => {
            /*
            //TODO do not auto accept make a origin allowed function
            if (!originIsAllowed(request.origin)) {
              // Make sure we only accept requests from an allowed origin
              request.reject();
              console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
              return;
            }
             */
            const connection = request.accept(request.requestedProtocols[0], request.origin);
            new tslog_1.Logger(loggerSettings_1.loggerSettings).debug("Connection accepted.");
            connection.on('message', (message) => {
                if (message.type === 'utf8') {
                    const logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
                    logger.debug('Received Message: ' + message.utf8Data);
                    let queryExecutor = queryExecutor_1.QueryExecutor.factory.get(message.utf8Data);
                    if (!queryExecutor) {
                        connection.sendUTF("Query UUID doesn't exist.");
                        return;
                    }
                    if (connection.protocol === this.readyProtocol || connection.protocol === this.generalProtocol) {
                        queryExecutor.on("queryEvent", (event) => {
                            logger.debug("queryEvent: " + event);
                            if (event === "initialized") {
                                logger.debug("sending initialized to client");
                                connection.sendUTF("initialized");
                            }
                        });
                        if (queryExecutor.isInitializationFinished()) {
                            logger.debug("sending initialized to client");
                            connection.sendUTF("initialized");
                        }
                    }
                    if (connection.protocol === this.bindingProtocol || connection.protocol === this.generalProtocol) {
                        queryExecutor.on("binding", (bindings, newBinding) => {
                            let startWord = "";
                            if (newBinding) {
                                startWord = "added ";
                            }
                            else {
                                startWord = "removed ";
                            }
                            for (const binding of bindings) {
                                connection.sendUTF(startWord + JSON.stringify(binding));
                            }
                        });
                        let bindings = queryExecutor.getData();
                        if (bindings.length > 0) {
                            for (const binding of bindings) {
                                connection.sendUTF("added " + JSON.stringify(binding));
                            }
                        }
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
