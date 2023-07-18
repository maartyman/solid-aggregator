#!/usr/bin/env node
import {HttpServer} from "./http/httpServer";
import {WebSocketHandler} from "./http/webSocketHandler";
import {program} from "commander";
import {GuardingConfig} from "./utils/guardingConfig";
import {Logger, TLogLevelName} from "tslog";
import {loggerSettings} from "./utils/loggerSettings";
import {loggerSettings as incremunicaLoggerSettings, QueryExecutor, QueryExplanation} from "incremunica";
import {TComunicaVersion} from "incremunica/src/queryExecutor/queryExplanation";
import {query1, query2} from "./utils/preloadedQueries";

export class AppRunner {
  static cli() {
    program
      .name("query-queryExecutor")
      .description("An intermediate server between the client and a solid pod.")
      .version(require("../package.json").version)

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
    incremunicaLoggerSettings.minLevel = debug;
    let logger = new Logger(loggerSettings);

    QueryExecutor.factory.getOrCreate(
      "0",
      QueryExecutor,
      new QueryExplanation(
        query1,
        [
          "https://server.solid-sandbox.vito.be/alice/health/regional_research_survey",
          "https://server.solid-sandbox.vito.be/alice/profile/card",
          "https://server.solid-sandbox.vito.be/alice/health/hospital-report"
        ],
      ),
      true
    )

    QueryExecutor.factory.getOrCreate(
      "1",
      QueryExecutor,
      new QueryExplanation(
        query2,
        [
          "https://server.solid-sandbox.vito.be/alice/health/regional_research_survey",
          "https://server.solid-sandbox.vito.be/alice/profile/card",
          "https://server.solid-sandbox.vito.be/alice/health/hospital-report"
        ],
      ),
      true
    )

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

