import {Logger} from "../utils/logger";
import {Bindings} from "@comunica/bindings-factory";
import {QueryEngine} from "@comunica/query-sparql";
//import {QueryEngine} from "@comunica/query-sparql-link-traversal";
import {QueryExplanation} from "./queryExplanation";
import {EventEmitter} from "events";
import {resolveUndefined} from "../utils/generalUtils";

export class Aggregator extends EventEmitter {
  private readonly logger = Logger.getInstance();
  private queryEngine: QueryEngine | undefined;
  private results = new Array<Bindings>();
  private queryEngineBuild = false;
  private queryFinished = false;
  public readonly UUID;

  public readonly queryExplanation: QueryExplanation;

  //private readonly tripleStore = new Store();

  constructor(queryExplanation: QueryExplanation, UUID: String) {
    super();
    this.queryExplanation = queryExplanation;
    this.UUID = UUID;

    //this.QueryEngineFactory = require(this.queryExplanation.comunicaVersion? this.queryExplanation.comunicaVersion : "@comunica/query-sparql-link-traversal").QueryEngineFactory;
    this.logger.debug("comunicaVersion = " + queryExplanation.comunicaVersion, "Aggregator");
    const queryEngineFactory = require(queryExplanation.comunicaVersion.toString()).QueryEngineFactory;

    this.logger.debug("comunica context path = " + queryExplanation.comunicaContext, "Aggregator");
    new queryEngineFactory().create({
      configPath: queryExplanation.comunicaContext,
    }).then((queryEngine: QueryEngine) => {
      this.queryEngine = queryEngine;
    }).finally(() => {
      this.logger.debug(`Comunica engine build`, "Aggregator");
      this.queryEngineBuild = true;
      this.emit("queryEngineEvent", "build");
      this.executeQuery();
      /*
        TODO guard data: websocket based or polling based?
      */
    });
  }

  private async executeQuery() {
    this.logger.debug(`Starting comunica query, with query: \n${ this.queryExplanation.queryString.toString() }`, "Aggregator");

    if (this.queryEngine == undefined) {
      throw new TypeError("queryEngine is undefined");
    }

    const bindingsStream = await this.queryEngine.queryBindings(
      this.queryExplanation.queryString.toString(), {
      sources: this.queryExplanation.sources,
      lenient: true,
    });

    bindingsStream.on('data', (binding: Bindings) => {
      this.logger.debug(`on data: ${ binding.toString() }`, "Aggregator");
      this.results.push(binding);

      this.emit("binding", {bindings: [binding]});
    });

    bindingsStream.on('end', () => {
      this.queryFinished = true;
      this.logger.debug(`Comunica query finished`, "Aggregator");
      this.emit("queryEvent", "done");
    });

    bindingsStream.on('error', (error: any) => {
      //TODO solve error
      this.logger.error(error, "Aggregator");
      this.emit("queryEvent", "error");
    });
  }

  public getData() : {bindings: (Bindings)[]} {
    /*
    const writer = new Writer();
    return writer.quadsToString(this.tripleStore.getQuads(null, null, null, null));
    */
    return {bindings: this.results};
  }

  public isQueryEngineBuild (): boolean {
    return this.queryEngineBuild;
  }

  public isQueryFinished (): boolean {
    return this.queryFinished;
  }
}
