import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {loggerSettings} from "../utils/loggerSettings";
import {Logger} from "tslog";
import {QueryExecutor, QueryExplanation} from "incremunica";
import {sh} from "../utils/sh";
import { IDataSource } from '@comunica/types';
import * as fs from "fs";
import fetch from "cross-fetch";

export class PostHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    let logger = new Logger(loggerSettings);
    logger.debug(`POST request received`);
    let body = await getHttpBody(req);

    logger.debug(JSON.stringify(body), "rules:", body.rules)

    if (body.rules !== undefined && body.rules !== "") {
      let rules = await (await fetch(body.rules)).text();
      let location = '/rules/' + (new Date()).valueOf() + '.rml.ttl';
      await new Promise<void>( (resolve, reject) => fs.writeFile(location, rules, err => {
        if (err) {
          reject(err);
        }
        resolve();
      }));

      const exec = "java -Djava.library.path=/usr/lib/swi-prolog/lib/x86_64-linux/ -jar /SRR/target/SRR-1.0-SNAPSHOT-jar-with-dependencies.jar"
      //let { stdout } = await sh(exec + " " + body.queryExplanation.queryString + " ./rules/rules.rml.ttl");
      //let { stdout } = await sh(exec + " '" + body.queryExplanation.queryString.replace(/(\r\n|\n|\r)/gm, "") + "'");

      let { stdout } = await sh(exec + " '" + body.queryExplanation.queryString + "' " + location);
      if (stdout != "") {
        logger.debug(`Query changed from:\n${body.queryExplanation.queryString}\nto:\n${stdout}`);
        (<MutableQueryExplanation>body.queryExplanation).queryString = stdout;
      }
    }

    logger.debug(`query: \n${JSON.stringify(body.queryExplanation)}`);
    let queryExecutor = await QueryExecutor.factory.getOrCreate(
      QueryExecutor.factory.queryExplanationToUUID(body.queryExplanation),
      QueryExecutor,
      body.queryExplanation,
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

class MutableQueryExplanation implements QueryExplanation {
  comunicaContext: string;
  comunicaVersion: string;
  lenient: boolean;
  queryString: string;
  reasoningRules: string;
  sources: [IDataSource, ...IDataSource[]];

  constructor(queryExplanation: QueryExplanation) {
    this.comunicaContext = queryExplanation.comunicaContext
    this.comunicaVersion = queryExplanation.comunicaVersion
    this.lenient = queryExplanation.lenient
    this.queryString = queryExplanation.queryString
    this.reasoningRules = queryExplanation.reasoningRules
    this.sources = queryExplanation.sources
  }
}
