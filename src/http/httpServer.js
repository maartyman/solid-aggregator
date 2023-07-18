"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const http_1 = require("http");
const events = __importStar(require("events"));
const getHandler_1 = require("./getHandler");
const postHandler_1 = require("./postHandler");
const tslog_1 = require("tslog");
const loggerSettings_1 = require("../utils/loggerSettings");
class HttpServer extends events.EventEmitter {
    constructor(port) {
        super();
        this.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        this.server = (0, http_1.createServer)(this.requestHandler).listen(port);
    }
    static setInstance(port) {
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
    requestHandler(req, res) {
        let requestHandlerLogger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        res.setHeader("Access-Control-Allow-Origin", "*");
        switch (req.method) {
            case "GET":
                getHandler_1.GetHandler.handle(req, res);
                break;
            case "POST":
                postHandler_1.PostHandler.handle(req, res);
                break;
            case "OPTIONS":
                res.statusCode = 200;
                res.end();
                break;
            default:
                requestHandlerLogger.error(`request method not known! method: [ ${req.method} ]`);
                res.statusCode = 500;
                res.end();
                break;
        }
    }
}
exports.HttpServer = HttpServer;
