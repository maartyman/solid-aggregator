import {QueryEngine} from "@comunica/query-sparql";
import {QueryEngineFactory} from "@comunica/query-sparql";

export class LocalQueryEngineFactory {
  private static engines = new Map<string, QueryEngine | Promise<QueryEngine>>();

  static async getOrCreate(comunicaVersion: string, comunicaContext: string): Promise<QueryEngine> {
    let tempEngine: QueryEngine | Promise<QueryEngine> | undefined = this.engines.get(comunicaVersion + comunicaContext);

    if (tempEngine != undefined) {
      return tempEngine;
    }

    const queryEngineFactory = require(comunicaVersion).QueryEngineFactory;

    tempEngine = (new queryEngineFactory() as QueryEngineFactory).create({
      configPath: comunicaContext,
    });

    if (tempEngine == undefined) {
      throw new Error("this shouldn't happen");
    }

    this.engines.set(comunicaVersion + comunicaContext, tempEngine);

    return tempEngine;
  }
}
