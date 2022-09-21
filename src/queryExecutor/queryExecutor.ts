import {Logger} from "tslog";
import {Bindings} from "@comunica/bindings-factory";
import {QueryEngine} from "@comunica/query-sparql";
import {QueryExplanation} from "./queryExplanation";
import {loggerSettings} from "../utils/loggerSettings";
import {KeysRdfReason} from "@comunica/reasoning-context-entries";
import {Store} from "n3";
import {QueryExecutorFactory} from "./queryExecutorFactory";
import {Actor} from "../utils/actor-factory/actor";
import {Guard} from "../guard/guard";
import {GuardPolling} from "../guard/guardPolling";
import {GuardFactory} from "../guard/guardFactory";

export class QueryExecutor extends Actor<string> {
  static factory = new QueryExecutorFactory();
  private readonly logger = new Logger(loggerSettings);
  private queryEngine: QueryEngine | undefined;
  private results = new Array<Bindings>();
  private queryEngineBuild = false;
  private queryFinished = false;
  private changedResources = new Array<string>();

  public queryExplanation: QueryExplanation;
  private guards = new Map<string, {guard: Guard, used: boolean}>;

  constructor(UUID:string, queryExplanation: QueryExplanation) {
    super(UUID);
    this.queryExplanation = queryExplanation;

    //this.QueryEngineFactory = require(this.queryExplanation.comunicaVersion? this.queryExplanation.comunicaVersion : "@comunica/query-sparql-link-traversal").QueryEngineFactory;
    this.logger.debug("comunicaVersion = " + queryExplanation.comunicaVersion);
    const queryEngineFactory = require(queryExplanation.comunicaVersion.toString()).QueryEngineFactory;

    this.logger.debug("comunica context path = " + queryExplanation.comunicaContext);
    new queryEngineFactory().create({
      configPath: queryExplanation.comunicaContext,
    }).then((queryEngine: QueryEngine) => {
      this.queryEngine = queryEngine;
      this.logger.debug(`Comunica engine build`);
      this.queryEngineBuild = true;
      this.emit("queryEngineEvent", "build");
      this.executeQuery();
    });
  }

  private async executeQuery() {
    this.queryFinished = false;
    this.guards.forEach((value) => {
      value.used = false;
    })
    this.logger.debug(`Starting comunica query, with query: \n${ this.queryExplanation.queryString.toString() }`);

    if (this.queryEngine == undefined) {
      throw new TypeError("queryEngine is undefined");
    }

    this.logger.debug(`Starting comunica query, with reasoningRules: \n${ this.queryExplanation.reasoningRules.toString() }`);

    let parallelPromise = new Array<Promise<any>>();
    for (const resource of this.changedResources) {
      parallelPromise.push(this.queryEngine.invalidateHttpCache(resource));
    }
    this.changedResources.splice(0);
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

      this.emit("binding", [binding]);
    });

    bindingsStream.on('end', () => {
      this.queryFinished = true;
      this.logger.debug(`Comunica query finished`);
      this.emit("queryEvent", "done");
      this.afterQueryCleanup();
    });

    bindingsStream.on('error', (error: any) => {
      //TODO solve error
      this.logger.error(error);
      this.emit("queryEvent", "error");
    });
  }

  private async customFetch(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
    //TODO check used resources: delete the ones that aren't used add the new ones
    //TODO possibly wait until the resource is actively guarded

    input = new URL(input.toString());
    input = input.origin + input.pathname;

    let guardObject = this.guards.get(input);

    if (!guardObject) {
      guardObject = {guard: await GuardPolling.factory.getOrCreate(input), used: true};

      if (!guardObject) {
        throw new Error("guard couldn't be instantiated;");
      }

      guardObject.guard.on("ResourceChanged", this.resourceChanged.bind(this, input));
    }

    if (!guardObject.guard.isGuardActive(input)) {
      await guardActive(guardObject.guard, input);
    }

    this.guards.set(input, guardObject);

    return fetch(input, init);
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

  private resourceChanged(resource: string, input: string) {
    this.logger.debug("data has changed with resource: " + resource + " and input: " + input);
    if (input === resource) {
      this.changedResources.push(resource);

      if (this.queryFinished) {
        this.executeQuery();
      }
    }
  }

  private afterQueryCleanup() {
    this.guards.forEach((value) => {
      if (!value.used) {
        value.guard.removeListener("ResourceChanged", this.resourceChanged);
        if (value.guard.listenerCount("ResourceChanged") == 0) {
          value.guard.delete();
        }
      }
    });
    if (this.changedResources.length > 0) {
      this.executeQuery();
    }
  }
}

async function guardActive(guard: Guard, input: string) {
  guard.on("guardActive", (resource: string, value: boolean) => {
    if (resource === input && value) {
      return;
    }
  });
}
