import {IncomingMessage, ServerResponse} from "http";
import {resolveUndefinedString} from "../utils/generalUtils";
import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";
import {QueryExecutor} from "../queryExecutor/queryExecutor";
import {setHeaders} from "./setHeaders";


export class GetHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    const logger = new Logger(loggerSettings);
    logger.debug(`GET request received`);
    logger.debug(`url: \n${req.url}`);
    const queryUUID = resolveUndefinedString(req.url).split("/")[1];
    logger.debug(`query: \n${queryUUID}`);
    const queryExecutor = QueryExecutor.factory.get(queryUUID);

    const hasNoError = setHeaders(logger, res, queryExecutor);

    if (hasNoError) {
      res.setHeader("Content-Type", "text/text");

      // @ts-ignore
      const returnValue = JSON.stringify(queryExecutor.getData());
      logger.debug(`result: \n${returnValue}`);
      res.write(returnValue);

      res.end();
    }
  }
}
