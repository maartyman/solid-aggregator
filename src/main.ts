#!/usr/bin/env node
import {HttpServer} from "./http/httpServer";
import {QueryExecutorFactory} from "./queryExecutorPackage/queryExecutor/queryExecutorFactory";
import {WebSocketHandler} from "./http/webSocketHandler";
import {program} from "commander";
import {GuardingConfig} from "./utils/guardingConfig";
import {Logger, TLogLevelName} from "tslog";
import {loggerSettings} from "./utils/loggerSettings";
import {GuardFactory} from "./queryExecutorPackage/guard/guardFactory";

export class AppRunner {
  static cli() {
    program
      .name("query-queryExecutor")
      .description("An intermediate server between the client and a solid pod.")
      .version("1.0.4")

    program.command("serve")
      .description("Start the Solid Aggregator Server.")
      .option(
        "-p, --port <portNumber>",
        "Defines the port of the server.",
        "3001"
      )
      .option(
        "--polling <pollingValue>",
        "Enables query guard and defines how long the server should wait between query's in milliseconds.",
        "10000"
      )
      .option(
        "-d, --debug <debugValue>",
        "Defines the debug level (error, warn, info, verbose, debug, silly).",
        "info"
      )
      .action((options) => {
        this.runApp(options.debug, options.port, options.polling)
      });

    program.parse();
  }

  static runApp(debug: TLogLevelName | undefined, port?: number, polling?: number) {
    loggerSettings.minLevel = debug;
    let logger = new Logger(loggerSettings);

    logger.debug(`starting httpServer`);
    HttpServer.setInstance(port? port : 3001);

    logger.debug(`setting up the data guarding`);
    if (polling) {
      GuardingConfig.pollingInterval = polling;
    }

    logger.debug(`starting the websocket`);
    WebSocketHandler.setInstance();

    logger.info(`Server Started on port ${ port }: http://localhost:${port}`);
  }
}

