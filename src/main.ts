import {Logger, LogType} from "./utils/logger";
import {HttpServer} from "./http/httpServer";
import {AggregatorKeeper} from "./aggregator/aggregatorKeeper";
import {WebSocketHandler} from "./http/webSocketHandler";
import {program} from "commander";
import {GuardingConfig} from "./utils/guardingConfig";

program
  .name("query-aggregator")
  .description("An intermediate server between the client and a solid pod.")
  .version("1.0.0")

//connect => list all bluetooth devices and select 1
program.command("start")
  .description("Start aggregator server")
  .option(
    "-p, --port <portNumber>",
    "Defines the port of the server. (default: 3001)",
    "3001"
  )
  .option(
    "--polling <pollingValue>",
    "Enables query guarding and defines how long the server should wait between query's in milliseconds. (default: 1000)",
    "1000"
  )
  .option(
  "-d, --debug <debugValue>",
  "Defines the debug level (error, warn, info, verbose, debug, silly). (default: info)",
  "info"
  )
  .action((options) => {
    let logger = Logger.setInstance(options.debug);

    logger.debug(`starting httpServer`, "main.js" );
    HttpServer.setInstance(options.port);

    logger.debug(`setting up the aggregator keeper`, "main.js" );
    let guardingConfig: GuardingConfig;
    if (options.polling) {
      guardingConfig = new GuardingConfig("polling", [options.polling]);
    }
    else {
      guardingConfig = GuardingConfig.default;
    }
    AggregatorKeeper.setInstance(guardingConfig);

    logger.debug(`starting the websocket`, "main.js" );
    WebSocketHandler.setInstance();

    logger.info(`Server Started on port ${ options.port }: http://localhost:${options.port}`, "main.js" )
  });

program.parse();
