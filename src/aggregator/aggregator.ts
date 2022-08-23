import {Logger} from "../utils/logger";
import {Quad, Store, Term, Writer} from "n3";
//import {QueryEngine} from "@comunica/query-sparql-link-traversal";
import {Bindings} from "@comunica/bindings-factory";
import {resolveUndefined} from "../utils/generalUtils";
import {QueryEngine} from "@comunica/query-sparql-link-traversal";

export class Aggregator {
  private readonly logger = Logger.getInstance();
  private readonly QueryEngine = require('@comunica/query-sparql-link-traversal').QueryEngine;
  private readonly engine;
  private results = "";
  private queryFinished = false;

  private readonly query: String;

  //private readonly tripleStore = new Store();

  constructor(query: String) {
    this.query = query;
    this.engine = new this.QueryEngine();
    /*
      first execute query but also guard it (=> check if changes are made to the data)
      guard: websocket based or polling based?
    */
    this.executeQuery();
  }

  private async executeQuery() {
    this.logger.debug(`Starting comunica query, with query: \n${ this.query.toString() }`, "Aggregator");

    const bindingsStream = await this.engine.queryBindings(
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
