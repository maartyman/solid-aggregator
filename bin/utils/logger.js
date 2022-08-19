"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LogType = void 0;
var LogType;
(function (LogType) {
    LogType["silly"] = "silly";
    LogType["debug"] = "debug";
    LogType["verbose"] = "verbose";
    LogType["info"] = "info";
    LogType["warn"] = "warn";
    LogType["error"] = "error";
})(LogType = exports.LogType || (exports.LogType = {}));
class Logger {
    constructor(loggerType) {
        // @ts-ignore
        this.logger = new (new require('lazy-logger'))(loggerType, true, './log/log-', 'yyyy-MM-dd');
    }
    static getInstance(loggerType) {
        if (this.instance == null) {
            this.instance = new Logger(loggerType);
            return this.instance;
        }
        return this.instance;
    }
    getString(instance) {
        if (typeof (instance) == "string") {
            return instance;
        }
        return instance.constructor.name;
    }
    silly(message, instance) {
        this.logger.silly(`[ ${this.getString(instance)} ] => ` + message);
    }
    debug(message, instance) {
        this.logger.debug(`[ ${this.getString(instance)} ] => ` + message);
    }
    verbose(message, instance) {
        this.logger.verbose(`[ ${this.getString(instance)} ] => ` + message);
    }
    info(message, instance) {
        this.logger.info(`[ ${this.getString(instance)} ] => ` + message);
    }
    warn(message, instance) {
        this.logger.warn(`[ ${this.getString(instance)} ] => ` + message);
    }
    error(message, instance) {
        this.logger.error(`[ ${this.getString(instance)} ] => ` + message);
    }
}
exports.Logger = Logger;
