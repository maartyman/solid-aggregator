import {Logger} from "../utils/logger";
import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {AggregatorKeeper} from "../aggregator/aggregatorKeeper";
import {resolveUndefinedString} from "../utils/generalUtils";


export class GetHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    const logger = Logger.getInstance();
    logger.debug(`GET request received`, this);
    logger.debug(`url: \n${req.url}`, "GetHandler");
    const queryUUID = resolveUndefinedString(req.url).split("/")[1];
    logger.debug(`query: \n${queryUUID}`, "GetHandler");
    const aggregator = AggregatorKeeper.getInstance().getAggregator(queryUUID);

    if (aggregator.isQueryFinished()) {
      /* add 200 response header */
      logger.debug(`GET status code: 200`, "GetHandler");
      res.statusCode = 200;
    }
    else {
      /* add 206 response header */
      logger.debug(`GET status code: 206`, "GetHandler");
      res.statusCode = 206;
    }

    res.setHeader("Content-Type", "text/text");

    const returnValue = JSON.stringify(aggregator.getData());
    logger.debug(`result: \n${returnValue}`, "GetHandler");
    res.write(returnValue);

    res.end();
  }
}
