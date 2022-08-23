import {Logger} from "../utils/logger";
import {Quad, Store, Term, Writer} from "n3";
import {Bindings} from "@comunica/bindings-factory";
import {resolveUndefined} from "../utils/generalUtils";
import {QueryEngine} from "@comunica/query-sparql-link-traversal";

export class Aggregator {
  private readonly logger = Logger.getInstance();
  private readonly QueryEngineFactory = require('@comunica/query-sparql-link-traversal').QueryEngineFactory;
  private results = "";
  private queryFinished = false;

  private readonly query: String;

  //private readonly tripleStore = new Store();

  constructor(query: String) {
    this.query = query;

    /*
      first execute query but also guard it (=> check if changes are made to the data)
      guard: websocket based or polling based?
    */
    this.executeQuery();
  }

  private async executeQuery() {
    this.logger.debug(`Starting comunica query, with query: \n${ this.query.toString() }`, "Aggregator");

    let engine = await new this.QueryEngineFactory().create({
      configPath: 'node_modules/@comunica/config-query-sparql-link-traversal/config/config-follow-all.json',
    });

    const bindingsStream = await engine.queryBindings(
      this.query , {
      sources: ['http://localhost:3000/user1/'], //TODO make variable
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
      this.queryFinished = true;
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

  public isQueryFinished () {
    return this.queryFinished;
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
