import {IncomingMessage, ServerResponse} from "http";
import {getHttpBody} from "../utils/getHttpBody";
import {loggerSettings} from "../utils/loggerSettings";
import {Logger} from "tslog";
import {QueryExecutor, QueryExplanation} from "incremunica";
import {sh} from "../utils/sh";
import { IDataSource } from '@comunica/types';
import * as fs from "fs";

export class PostHandler {
  public static async handle(req: IncomingMessage, res: ServerResponse) {
    let logger = new Logger(loggerSettings);
    logger.debug(`POST request received`);
    let fileName = (new Date()).valueOf() + '.rml.ttl';
    let location = '/rules/' + fileName;
    //let location = '/home/maarten/Documents/doctoraat/code/solid-agent/rules/' + fileName;
    //let ruleFileNames = '"/rules/ggdm-identity.rml.ttl" "/rules/ggdm-privacy.rml.ttl"';
    let ruleFileNames = ""; //'"/rules/ggdm-identity.rml.ttl" "/rules/ggdm-privacy.rml.ttl" "/rules/fhir-to-ggdm.rml.ttl"';
    let fileCreated = false;
    try {
      let body = await getHttpBody(req);

      logger.debug(JSON.stringify(body));

      let query = body.queryExplanation.queryString;
      //let location = '/rules/' + fileName;
      if (body.rules && body.rules !== "") {
        logger.debug("saving rules", body.rules);
        await new Promise<void>((resolve, reject) => fs.writeFile(location, body.rules, err => {
          if (err) {
            logger.debug("error saving rules");
            fs.unlinkSync(location);
            reject(err);
          }
          fileCreated = true;
          ruleFileNames += ' "' + location + '"';
          resolve();
        }));

        const exec = "java -Djava.library.path=/usr/lib/swi-prolog/lib/x86_64-linux/ -jar /SRR/target/SRR-1.1-SNAPSHOT-jar-with-dependencies.jar"
        //const exec = "docker run srr";
        //let { stdout } = await sh(exec + " " + body.queryExplanation.queryString + " ./rules/rules.rml.ttl");
        //let { stdout } = await sh(exec + " '" + body.queryExplanation.queryString.replace(/(\r\n|\n|\r)/gm, "") + "'");

        logger.debug("exec: " + exec + " '" + body.queryExplanation.queryString + "' " + ruleFileNames);
        let {stdout} = await sh(exec + " '" + body.queryExplanation.queryString + "' " + ruleFileNames);

        logger.debug("output: " + stdout);

        if (stdout !== "") {
          query = stdout.replace(new RegExp("bnode(".replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), "BNODE(");
          logger.debug(`Query changed from:\n${body.queryExplanation.queryString}\nto:\n${query}`);
        }
      }
      else {
        logger.debug(`Writing 200: Ok`);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({bindings: [], query: "SELECT  *\n" +
            "WHERE\n" +
            "  { {  }\n" +
            "    FILTER ( false )\n" +
            "  }"}));
        res.end();

        if (fileCreated) {
          fs.unlinkSync(location);
        }

        return;
      }

      let queryExplanation = new QueryExplanation(
        query,
        body.queryExplanation.sources,
        "default",
    "default",
        "",
        true
      );

      logger.debug(`query: \n${JSON.stringify(queryExplanation)}`);
      let queryExecutor = await QueryExecutor.factory.getOrCreate(
        QueryExecutor.factory.queryExplanationToUUID(queryExplanation),
        QueryExecutor,
        queryExplanation,
        false
      );

      logger.debug(`Writing 200: Ok`);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({bindings: await queryExecutor.getData(), query: query}));
      res.end();
      queryExecutor.delete();
    }
    catch (e: any) {
      logger.debug(`Writing 500: ` + e);
      res.statusCode = 500;
      res.write(JSON.stringify({error: e}));
      res.end();
    }

    if (fileCreated) {
      fs.unlinkSync(location);
    }
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
