import {Logger} from "../utils/logger";
import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {AggregatorKeeper} from "../aggregator/aggregatorKeeper";


export class GetHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    const logger = Logger.getInstance();
    logger.debug(`GET request received`, this);
    const query = await getHttpBody(req);
    logger.debug(`query: \n${query}`, "GetHandler");
    const aggregator = AggregatorKeeper.getInstance().getAggregator(query);

    if (aggregator.isQueryFinished()) {
      /* add 200 response header */
      res.statusCode = 200;
    }
    else {
      /* add 206 response header */
      res.statusCode = 206;
    }
    // add turtle to body
    res.setHeader("Content-Type", "text/turtle");

    const RDFTriples = aggregator.getData();
    logger.debug(`result: \n${RDFTriples}`, "GetHandler");
    res.write(RDFTriples);

    res.end();
  }
}
