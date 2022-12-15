import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {loggerSettings} from "../utils/loggerSettings";
import {Logger} from "tslog";
import {QueryExecutor} from "incremunica";

export class PostHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    let logger = new Logger(loggerSettings);
    logger.debug(`POST request received`);
    let queryExplanation = await getHttpBody(req);
    logger.debug(`query: \n${JSON.stringify(queryExplanation)}`);
    let queryExecutor = await QueryExecutor.factory.getOrCreate(
      QueryExecutor.factory.queryExplanationToUUID(queryExplanation),
      QueryExecutor,
      queryExplanation,
      true
    );
    //TODO return HTTP 500 code on failure
    logger.debug(`Writing 200: Ok`);
    res.statusCode = 200;
    res.setHeader("Location", queryExecutor.key.toString());
    res.write(JSON.stringify(await queryExecutor.getData()));
    res.end();
    /*
    else {
      queryExecutor.on("queryEngineEvent", (value) => {
        if (value == "build") {
          logger.debug(`Writing 201: Created`);
          res.statusCode = 201;
          res.setHeader("Location", queryExecutor.key.toString());
          res.write(JSON.stringify({bindings: queryExecutor.getData()}));
          res.end();
        }
      });
    }
     */
  }
}
