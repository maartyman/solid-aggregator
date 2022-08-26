import {Logger} from "../utils/logger";
import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {AggregatorKeeper} from "../aggregator/aggregatorKeeper";


export class PostHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    let logger = Logger.getInstance();
    logger.debug(`POST request received`, this);
    let query = await getHttpBody(req);
    logger.debug(`query: \n${JSON.stringify(query)}`, "PostHandler");
    let aggregator = AggregatorKeeper.getInstance().addAggregator(query);
    //TODO return HTTP 500 code on failure
    //res.statusCode = 202;
    //res.setHeader("Location", aggregator.UUID.toString());
    //logger.debug(`Writing 102`, "PostHandler");
    /*
    res.write("");
    */
    if (aggregator.isQueryEngineBuild()){
      logger.debug(`Writing 201: Created`, "PostHandler");
      res.statusCode = 200;
      res.setHeader("Location", aggregator.UUID.toString());
      res.write(JSON.stringify(aggregator.getData()));
      res.end();
    }
    else {
      aggregator.on("queryEngineEvent", (value) => {
        if (value == "build") {
          logger.debug(`Writing 201: Created`, "PostHandler");
          res.statusCode = 201;
          res.setHeader("Location", aggregator.UUID.toString());
          res.write(JSON.stringify(aggregator.getData()));
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
