import {HttpServer} from "./http/httpServer";
import {AggregatorKeeper} from "./aggregator/aggregatorKeeper";
import {WebSocketHandler} from "./http/webSocketHandler";
import {program} from "commander";
import {GuardingConfig} from "./utils/guardingConfig";
import {Logger} from "tslog";
import {loggerSettings} from "./utils/loggerSettings";

program
  .name("query-aggregator")
  .description("An intermediate server between the client and a solid pod.")
  .version("1.0.0")

//connect => list all bluetooth devices and select 1
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
    "1000"
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
    let guardingConfig: GuardingConfig;
    if (options.polling) {
      guardingConfig = new GuardingConfig("polling", [options.polling]);
    }
    else {
      guardingConfig = GuardingConfig.default;
    }
    AggregatorKeeper.setInstance(guardingConfig);

    logger.debug(`starting the websocket`);
    WebSocketHandler.setInstance();

    logger.info(`Server Started on port ${ options.port }: http://localhost:${options.port}`);
  });

program.parse();
