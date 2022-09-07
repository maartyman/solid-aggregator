import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {AggregatorKeeper} from "../aggregator/aggregatorKeeper";
import {loggerSettings} from "../utils/loggerSettings";
import {Logger} from "tslog";


export class PostHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    let logger = new Logger(loggerSettings);
    logger.debug(`POST request received`);
    let query = await getHttpBody(req);
    logger.debug(`query: \n${JSON.stringify(query)}`);
    let aggregator = AggregatorKeeper.getInstance().addAggregator(query);
    //TODO return HTTP 500 code on failure
    //res.statusCode = 202;
    //res.setHeader("Location", aggregator.UUID.toString());
    //logger.debug(`Writing 102`);
    /*
    res.write("");
    */
    if (aggregator.isQueryEngineBuild()){
      logger.debug(`Writing 201: Created`);
      res.statusCode = 200;
      res.setHeader("Location", aggregator.UUID.toString());
      res.write(JSON.stringify({bindings: aggregator.getData()}));
      res.end();
    }
    else {
      aggregator.on("queryEngineEvent", (value) => {
        if (value == "build") {
          logger.debug(`Writing 201: Created`);
          res.statusCode = 201;
          res.setHeader("Location", aggregator.UUID.toString());
          res.write(JSON.stringify({bindings: aggregator.getData()}));
          res.end();
        }
      });
    }

    /*
    aggregator.on("queryEvent", (value) => {
      if (value == "done") {
      }
    });

     */
  }
}
