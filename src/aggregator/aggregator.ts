import {Logger} from "tslog";
import {Bindings} from "@comunica/bindings-factory";
import {QueryEngine} from "@comunica/query-sparql";
import {QueryExplanation} from "./queryExplanation";
import {EventEmitter} from "events";
import {loggerSettings} from "../utils/loggerSettings";
import {KeysRdfReason} from "@comunica/reasoning-context-entries";
import {Store} from "n3";
import {GuardKeeper} from "../guarding/guardKeeper";

export class Aggregator extends EventEmitter {
  private readonly logger = new Logger(loggerSettings);
  private queryEngine: QueryEngine | undefined;
  private results = new Array<Bindings>();
  private queryEngineBuild = false;
  private queryFinished = false;
  private reevaluateResources = new Array<string>();

  public readonly UUID;
  public readonly queryExplanation: QueryExplanation;

  //private readonly tripleStore = new Store();

  constructor(queryExplanation: QueryExplanation, UUID: String) {
    super();
    this.queryExplanation = queryExplanation;
    this.UUID = UUID;

    this.on("queryEvent", (message) => {
      if (message === "done" && this.reevaluateResources.length > 0) {
        this.executeQuery();
      }
    });

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
    });
  }

  private async executeQuery() {
    this.queryFinished = false;
    this.logger.debug(`Starting comunica query, with query: \n${ this.queryExplanation.queryString.toString() }`);

    if (this.queryEngine == undefined) {
      throw new TypeError("queryEngine is undefined");
    }

    this.logger.debug(`Starting comunica query, with reasoningRules: \n${ this.queryExplanation.reasoningRules.toString() }`);

    let parallelPromise = new Array<Promise<any>>();
    for (const resource of this.reevaluateResources) {
      parallelPromise.push(this.queryEngine.invalidateHttpCache(resource));
    }
    this.reevaluateResources.splice(0);
    await Promise.all(parallelPromise);

    const bindingsStream = await this.queryEngine.queryBindings(
      this.queryExplanation.queryString.toString(), {
      sources: this.queryExplanation.sources,
      [KeysRdfReason.implicitDatasetFactory.name]: () => new Store(),
      [KeysRdfReason.rules.name]: this.queryExplanation.reasoningRules.toString(),
      fetch: this.customFetch.bind(this),
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

  private customFetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
    GuardKeeper.getInstance().addGuard(input.toString(), this);

    return fetch(input, init);
  }

  public dataChanged(resource: string) {
    this.reevaluateResources.push(resource);

    if (this.queryFinished) {
      this.executeQuery();
    }
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
