#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRunner = void 0;
const httpServer_1 = require("./http/httpServer");
const webSocketHandler_1 = require("./http/webSocketHandler");
const commander_1 = require("commander");
const guardingConfig_1 = require("./utils/guardingConfig");
const tslog_1 = require("tslog");
const loggerSettings_1 = require("./utils/loggerSettings");
class AppRunner {
    static cli() {
        commander_1.program
            .name("query-queryExecutor")
            .description("An intermediate server between the client and a solid pod.")
            .version("1.0.4");
        commander_1.program.command("serve")
            .description("Start the Solid Aggregator Server.")
            .option("-p, --port <portNumber>", "Defines the port of the server.", "3001")
            .option("--polling <pollingValue>", "Enables query guard and defines how long the server should wait between query's in milliseconds.", "10000")
            .option("-d, --debug <debugValue>", "Defines the debug level (error, warn, info, verbose, debug, silly).", "info")
            .action((options) => {
            this.runApp(options.debug, options.port, options.polling);
        });
        commander_1.program.parse();
    }
    static runApp(debug, port, polling) {
        loggerSettings_1.loggerSettings.minLevel = debug;
        let logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        logger.debug(`starting httpServer`);
        httpServer_1.HttpServer.setInstance(port ? port : 3001);
        logger.debug(`setting up the data guarding`);
        if (polling) {
            guardingConfig_1.GuardingConfig.pollingInterval = polling;
        }
        logger.debug(`starting the websocket`);
        webSocketHandler_1.WebSocketHandler.setInstance();
        logger.info(`Server Started on port ${port}: http://localhost:${port}`);
    }
}
exports.AppRunner = AppRunner;
