import {Logger} from "../utils/logger";
import {Quad, Store, Term, Writer} from "n3";
import {Bindings} from "@comunica/bindings-factory";
import {resolveUndefined} from "../utils/generalUtils";
//import {QueryEngine, QueryEngineFactory} from "@comunica/query-sparql";
import {QueryEngine} from "@comunica/query-sparql-link-traversal";
import {QueryExplanation} from "./queryExplanation";

export class Aggregator {
  private readonly logger = Logger.getInstance();
  private queryEngine: QueryEngine | undefined;
  private results = "";
  private queryFinished = Promise<Boolean>;
  public readonly UUID;

  public readonly queryExplanation: QueryExplanation;

  //private readonly tripleStore = new Store();

  constructor(queryExplanation: QueryExplanation, UUID: String) {
    this.queryExplanation = queryExplanation;
    this.UUID = UUID;

    //this.QueryEngineFactory = require(this.queryExplanation.comunicaVersion? this.queryExplanation.comunicaVersion : "@comunica/query-sparql-link-traversal").QueryEngineFactory;
    const queryEngineFactory = require("@comunica/query-sparql-link-traversal").QueryEngineFactory;

    new queryEngineFactory().create({
      configPath: 'node_modules/@comunica/config-query-sparql-link-traversal/config/config-follow-all.json',
    }).then((queryEngine: QueryEngine) => {
      this.queryEngine = queryEngine;
    }).finally(() => {
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
      this.results += binding.get('n')?.value + "\n";
      /*
      try {
        this.tripleStore.add(
          new Quad(
            <Term>resolveUndefined(binding.get('s')),
            <Term>resolveUndefined(binding.get('p')),
            <Term>resolveUndefined(binding.get('o')),
          )
        );
      }
      catch (e) {
        this.logger.debug("Tripple didn't have all 3 values set, ignoring it", "Aggregator");
      }
      */
    });

    bindingsStream.on('end', () => {
      this.queryFinished.resolve(true);
      this.logger.debug(`Comunica query finished`, "Aggregator");
    });

    bindingsStream.on('error', (error: any) => {
      this.logger.error(error, "Aggregator");
    });
  }

  public getData() : String {
    /*
    const writer = new Writer();
    return writer.quadsToString(this.tripleStore.getQuads(null, null, null, null));
    */
    return this.results;
  }

  public isQueryFinished (): Promise<boolean> {
    return this.queryFinished.prototype;
  }
}



/*
comunica-dynamic-sparql-link-traversal http://localhost:3000/user1/ -c '
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql/^2.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/@comunica/config-query-sparql-link-traversal/^0.0.0/components/context.jsonld"],
  "import": [
    "ccqslt:configs/configs-base.json",
    "ccqslt:configs/extract-links/actors/all.json"
  ]
}' -q '
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?n WHERE {
  ?p a foaf:Person .
  ?p foaf:name ?n .
}'
 */
