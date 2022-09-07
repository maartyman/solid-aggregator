import {Logger} from "tslog";
import {Bindings} from "@comunica/bindings-factory";
import {QueryEngine} from "@comunica/query-sparql";
//import {QueryEngine} from "@comunica/query-sparql-link-traversal";
import {QueryExplanation} from "./queryExplanation";
import {EventEmitter} from "events";
import {resolveUndefined} from "../utils/generalUtils";
import {AggregatorKeeper} from "./aggregatorKeeper";
import {loggerSettings} from "../utils/loggerSettings";

export class Aggregator extends EventEmitter {
  private readonly logger = new Logger(loggerSettings);
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
    this.logger.debug("comunicaVersion = " + queryExplanation.comunicaVersion);
    const queryEngineFactory = require(queryExplanation.comunicaVersion.toString()).QueryEngineFactory;

    this.logger.debug("comunica context path = " + queryExplanation.comunicaContext);
    new queryEngineFactory().create({
      configPath: queryExplanation.comunicaContext,
    }).then((queryEngine: QueryEngine) => {
      this.queryEngine = queryEngine;
    }).finally(() => {
      this.logger.debug(`Comunica engine build`);
      this.queryEngineBuild = true;
      this.emit("queryEngineEvent", "build");
      this.executeQuery();
      this.guardQuery();
    });
  }

  private async executeQuery() {
    this.logger.debug(`Starting comunica query, with query: \n${ this.queryExplanation.queryString.toString() }`);

    if (this.queryEngine == undefined) {
      throw new TypeError("queryEngine is undefined");
    }

    const bindingsStream = await this.queryEngine.queryBindings(
      this.queryExplanation.queryString.toString(), {
      sources: this.queryExplanation.sources,
      lenient: this.queryExplanation.lenient
    });

    bindingsStream.on('data', (binding: Bindings) => {
      //TODO handle delete not only additions
      this.logger.debug(`on data: ${ binding.toString() }`);
      this.results.push(binding);

      this.emit("binding", {bindings: [binding]});
    });

    bindingsStream.on('end', () => {
      this.queryFinished = true;
      this.logger.debug(`Comunica query finished`);
      this.emit("queryEvent", "done");
    });

    bindingsStream.on('error', (error: any) => {
      //TODO solve error
      this.logger.error(error);
      this.emit("queryEvent", "error");
    });
  }

  private guardQuery() {
    //TODO implement sub/pub for when sub/pub works
    //TODO if sub/pub is not available fall back on polling
    this.on("queryEvent", (message) => {
      if (message === "done") {
        if (AggregatorKeeper.getInstance().guardingConfig.guardingType === "polling") {
          let pollingEvery = Number.parseInt(AggregatorKeeper.getInstance().guardingConfig.args[0]);
          this.logger.debug(`polling in ${pollingEvery/1000} seconds`);
          setTimeout(this.executeQuery.bind(this), pollingEvery);
        }
      }
    });
  }

  public getData() : Bindings[] {
    return this.results;
  }

  public isQueryEngineBuild (): boolean {
    return this.queryEngineBuild;
  }

  public isQueryFinished (): boolean {
    return this.queryFinished;
  }
}
