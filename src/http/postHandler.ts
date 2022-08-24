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
    res.statusCode = 202;
    res.setHeader("Location", aggregator.UUID.toString());
    logger.debug(`Writing 202`, "PostHandler");
    res.write("");
    res.statusCode = 201;
    res.setHeader("Location", aggregator.UUID.toString());
    aggregator.isQueryFinished().then((value: boolean) => {
      if (value) {
        logger.debug(`Writing 201`, "PostHandler");
        res.write("");
        res.end();
      }
    });
  }
}
