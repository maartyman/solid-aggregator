import {Logger} from "../utils/logger";
import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {AggregatorKeeper} from "../aggregator/aggregatorKeeper";


export class PostHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    let logger = Logger.getInstance();
    logger.debug(`POST request received`, this);
    let query = await getHttpBody(req);
    logger.debug(`query: \n${query}`, "PostHandler");
    AggregatorKeeper.getInstance().addAggregator(query);
    res.end();
  }
}
