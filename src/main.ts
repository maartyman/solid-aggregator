import {HttpServer} from "./http/httpServer";
import {AggregatorKeeper} from "./aggregator/aggregatorKeeper";
import {WebSocketHandler} from "./http/webSocketHandler";
import {program} from "commander";
import {GuardingConfig} from "./utils/guardingConfig";
import {Logger} from "tslog";
import {loggerSettings} from "./utils/loggerSettings";
import {GuardKeeper} from "./guarding/guardKeeper";

program
  .name("query-aggregator")
  .description("An intermediate server between the client and a solid pod.")
  .version("1.0.0")

program.command("serve")
  .description("Start the Solid Aggregator Server.")
  .option(
    "-p, --port <portNumber>",
    "Defines the port of the server.",
    "3001"
  )
  .option(
    "--polling <pollingValue>",
    "Enables query guarding and defines how long the server should wait between query's in milliseconds.",
    "10000"
  )
  .option(
  "-d, --debug <debugValue>",
  "Defines the debug level (error, warn, info, verbose, debug, silly).",
  "info"
  )
  .action((options) => {
    loggerSettings.minLevel = options.debug;
    let logger = new Logger(loggerSettings);

    logger.debug(`starting httpServer`);
    HttpServer.setInstance(options.port);

    logger.debug(`setting up the aggregator keeper`);
    AggregatorKeeper.setInstance();

    logger.debug(`setting up the data guarding`);
    if (options.polling) {
      GuardingConfig.pollingInterval = options.polling;
    }
    GuardKeeper.setInstance();

    logger.debug(`starting the websocket`);
    WebSocketHandler.setInstance();

    logger.info(`Server Started on port ${ options.port }: http://localhost:${options.port}`);
  });

program.parse();
