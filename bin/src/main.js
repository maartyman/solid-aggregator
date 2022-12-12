"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpServer_1 = require("./http/httpServer");
const aggregatorKeeper_1 = require("./aggregator/aggregatorKeeper");
const webSocketHandler_1 = require("./http/webSocketHandler");
const commander_1 = require("commander");
const guardingConfig_1 = require("./utils/guardingConfig");
const tslog_1 = require("tslog");
const loggerSettings_1 = require("./utils/loggerSettings");
commander_1.program
    .name("query-queryExecutor")
    .description("An intermediate server between the client and a solid pod.")
    .version("1.0.0");
commander_1.program.command("serve")
    .description("Start the Solid Aggregator Server.")
    .option("-p, --port <portNumber>", "Defines the port of the server.", "3001")
    .option("--polling <pollingValue>", "Enables query guard and defines how long the server should wait between query's in milliseconds.", "10000")
    .option("-d, --debug <debugValue>", "Defines the debug level (error, warn, info, verbose, debug, silly).", "info")
    .action((options) => {
    loggerSettings_1.loggerSettings.minLevel = options.debug;
    let logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
    logger.debug(`starting httpServer`);
    httpServer_1.HttpServer.setInstance(options.port);
    logger.debug(`setting up the aggregator keeper`);
    let guardingConfig;
    if (options.polling) {
        guardingConfig = new guardingConfig_1.GuardingConfig("polling", [options.polling]);
    }
    else {
        guardingConfig = guardingConfig_1.GuardingConfig.default;
    }
    aggregatorKeeper_1.AggregatorKeeper.setInstance(guardingConfig);
    logger.debug(`starting the websocket`);
    webSocketHandler_1.WebSocketHandler.setInstance();
    logger.info(`Server Started on port ${options.port}: http://localhost:${options.port}`);
});
commander_1.program.parse();
