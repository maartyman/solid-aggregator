import {Logger} from "../utils/logger";
import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {AggregatorKeeper} from "../aggregator/aggregatorKeeper";


export class GetHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    const logger = Logger.getInstance();
    logger.debug(`GET request received`, this);
    const query = await getHttpBody(req);
    logger.debug(`query: ${query}`, this);
    const aggregator = AggregatorKeeper.getInstance().getAggregator(query);

    if (aggregator.isQueryFinished()) {
      /* TODO add 200 response header */
    }
    else {
      /* TODO add 206 response header */
    }
    // TODO parse n3 store to turtle and add to body
    aggregator.getdata();

    res.end();
  }
}
