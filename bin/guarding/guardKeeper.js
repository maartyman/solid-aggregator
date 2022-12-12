"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardKeeper = void 0;
const tslog_1 = require("tslog");
const loggerSettings_1 = require("../utils/loggerSettings");
const guardWebSockets_1 = require("./guardWebSockets");
const guardPolling_1 = require("./guardPolling");
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
class GuardKeeper {
    constructor() {
        this.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        this.guards = new Map();
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
            new tslog_1.Logger(loggerSettings_1.loggerSettings).error("AggregatorKeeper was not instantiated, instantiating it now with default values.", this);
        }
        return this.instance;
    }
    addGuard(resource, aggregator) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL(resource);
            let guard = this.guards.get(url.host);
            if (!guard) {
                if (yield this.checkWebSocketAvailability(url.host)) {
                    guard = new guardWebSockets_1.GuardWebSockets(url.host);
                }
                else {
                    guard = new guardPolling_1.GuardPolling();
                }
                this.guards.set(url.host, guard);
            }
            guard.evaluateResource(resource, aggregator);
        });
    }
    checkWebSocketAvailability(host) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO is this the best solution?
            this.logger.debug("Checking pod availability");
            const WebSocketClient = require('websocket').client;
            const ws = new WebSocketClient();
            const promise = new Promise(resolve => {
                ws.on('connect', (connection) => {
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
        });
    }
}
exports.GuardKeeper = GuardKeeper;
