import {Logger} from "../utils/logger";
import {CustomMap} from "../utils/customMap";
import {Aggregator} from "./aggregator";

export class AggregatorKeeper {
  private static instance: AggregatorKeeper | null;
  private aggregators;

  constructor() {
    /*
    TODO make a better searchable store that links query strings to n3 stores
    */
    this.aggregators = new CustomMap();
  }

  static setInstance() {
    if (this.instance == null) {
      this.instance = new AggregatorKeeper();
    }
    return this.instance;
  }

  static getInstance() {
    if (this.instance == null) {
      this.instance = new AggregatorKeeper();
      Logger.getInstance().warn("AggregatorKeeper was not instantiated, instantiating it now", this);
    }
    return this.instance;
  }

  public addAggregator(queryString: String) {
    this.aggregators.set(queryString, new Aggregator(queryString));
  }

  public getAggregator(queryString: String) : Aggregator {
    return this.aggregators.get(queryString);
  }

}
