import {IncomingMessage, ServerResponse} from "http";
import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";
import {QueryExecutor} from "incremunica";
import {setHeaders} from "./setHeaders";
import {resolveUndefined} from "../utils/resolveUndefined";


export class GetHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    const logger = new Logger(loggerSettings);
    logger.debug(`Head request received`);
    logger.debug(`url: \n${req.url}`);
    const queryUUID = resolveUndefined(req.url, "").split("/")[1];
    logger.debug(`query: \n${queryUUID}`);
    const queryExecutor = QueryExecutor.factory.get(queryUUID);

    const hasNoError = setHeaders(logger, res, queryExecutor);

    if (hasNoError) {
      res.write("");
      res.end();
    }
  }
}
