import {IncomingMessage, ServerResponse} from "http";
import {resolveUndefinedString} from "../utils/generalUtils";
import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";
import {QueryExecutor} from "../queryExecutor/queryExecutor";


export class GetHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    const logger = new Logger(loggerSettings);
    logger.debug(`GET request received`);
    logger.debug(`url: \n${req.url}`);
    const queryUUID = resolveUndefinedString(req.url).split("/")[1];
    logger.debug(`query: \n${queryUUID}`);
    const queryExecutor = QueryExecutor.factory.get(queryUUID);

    if(!queryExecutor) {
      res.statusCode = 404;
      res.write("");
      res.end();
      return;
    }

    if (queryExecutor.isQueryFinished()) {
      /* add 200 response header */
      logger.debug(`GET status code: 200`);
      res.statusCode = 200;
    }
    else {
      /* add 206 response header */
      logger.debug(`GET status code: 206`);
      res.statusCode = 206;
    }

    res.setHeader("Content-Type", "text/text");

    const returnValue = JSON.stringify({bindings: queryExecutor.getData()});
    logger.debug(`result: \n${returnValue}`);
    res.write(returnValue);

    res.end();
  }
}
