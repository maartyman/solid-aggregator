import {QueryExecutor} from "../queryExecutor/queryExecutor";
import {ServerResponse} from "http";
import {Logger} from "tslog";

export function setHeaders(logger: Logger, res: ServerResponse, queryExecutor: QueryExecutor | undefined) : boolean {
  if(!queryExecutor) {
    res.statusCode = 404;
    res.write("");
    res.end();
    return false;
  }
  if (!queryExecutor.isInitializationFinished()) {
    /* add 425 response header */
    logger.debug(`Header status code: 425`);
    res.statusCode = 425;
    res.write("");
    res.end();
    return false;
  }
  if (!queryExecutor.isQueryFinished()) {
    /* add 206 response header */
    logger.debug(`Header status code: 206`);
    res.statusCode = 206;
    res.setHeader("ETag", "");
    return true;
  }
  /* add 200 response header */
  logger.debug(`Header status code: 200`);
  res.statusCode = 200;
  res.setHeader("ETag", "");
  return true;
}
