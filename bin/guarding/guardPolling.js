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
exports.GuardPolling = void 0;
const tslog_1 = require("tslog");
const loggerSettings_1 = require("../utils/loggerSettings");
const http = __importStar(require("http"));
const guardingConfig_1 = require("../utils/guardingConfig");
class GuardPolling {
    constructor() {
        this.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        this.notifiers = new Map();
    }
    evaluateResource(resource, aggregator) {
        //make sure resource isn't already polled before its added
        const polResource = this.notifiers.get(resource);
        if (polResource) {
            polResource.addAggregator(aggregator);
        }
        else {
            this.notifiers.set(resource, new PolResource(resource, aggregator));
        }
    }
}
exports.GuardPolling = GuardPolling;
class PolResource {
    constructor(resource, aggregator) {
        this.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        this.resource = resource;
        this.aggregators = [aggregator];
        this.getHead((res) => {
            const lastModifiedServer = res.headers["last-modified"];
            const ETagServer = res.headers.etag;
            if (ETagServer) {
                this.ETag = ETagServer;
            }
            else if (lastModifiedServer) {
                this.lastModified = new Date(lastModifiedServer).valueOf();
            }
            else {
                this.logger.error("Can't guard resource: '" + this.resource + "'. Server doesn't support Web Sockets nor does it support 'last-modified' or 'eTag' headers.");
            }
        });
        this.polHeadResource();
    }
    polHeadResource() {
        this.getHead((res) => {
            if (this.ETag) {
                if (res.headers.etag !== this.ETag) {
                    this.ETag = res.headers.etag;
                    this.dataChanged();
                }
            }
            else if (this.lastModified) {
                const lastModifiedServer = res.headers["last-modified"];
                if (lastModifiedServer) {
                    const lastModifiedDateServer = new Date(lastModifiedServer).valueOf();
                    if (lastModifiedDateServer != this.lastModified) {
                        this.lastModified = lastModifiedDateServer;
                        this.dataChanged();
                    }
                }
                else {
                    this.logger.error("Last modified tag isn't set by the server for resource: '" + this.resource + "'");
                }
            }
        });
        setTimeout(this.polHeadResource.bind(this), guardingConfig_1.GuardingConfig.pollingInterval);
    }
    getHead(callback) {
        const req = http.request(this.resource, {
            method: "HEAD"
        }, callback);
        req.end();
    }
    addAggregator(aggregator) {
        if (!this.aggregators.includes(aggregator)) {
            this.aggregators.push(aggregator);
        }
    }
    dataChanged() {
        for (const aggregator of this.aggregators) {
            this.logger.debug("data has changed in resource: " + this.resource);
            aggregator.dataChanged(this.resource);
        }
    }
}
