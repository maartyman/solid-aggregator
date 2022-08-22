import {Logger} from "../utils/logger";
const QueryEngine = require('@comunica/query-sparql-link-traversal').QueryEngine;
const myEngine = new QueryEngine();
import { Store } from "n3";


export class Aggregator {
  private logger;
  private query;
  private queryFinished = false;
  private tripleStore : Store;

  constructor(query: String) {
    this.logger = Logger.getInstance();
    this.query = query;
    this.tripleStore = new Store();
    /*
      first execute query but also guard it (=> check if changes are made to the data)
      guard: websocket based or polling based?
    */
    this.executeQuery();
  }

  private async executeQuery() {
    const bindingsStream = await myEngine.queryBindings(
      this.query , {
      sources: ['http://localhost:3000/user1/'], //TODO make variable
      lenient: true,
    });
    // TODO fix types
    bindingsStream.on('data', (binding: any) => {
      // TODO add to n3 store
    });
    bindingsStream.on('end', () => {
      // TODO queryFinished => true
    });
    bindingsStream.on('error', (error: any) => {
      Logger.getInstance().error(error, "aggregators.ts");
    });
  }

  public getdata() : Store {
    return this.tripleStore;
  }

  public isQueryFinished () {
    return this.queryFinished;
  }
}
