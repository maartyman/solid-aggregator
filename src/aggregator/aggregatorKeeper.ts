import {Logger} from "../utils/logger";
import {CustomMap} from "../utils/customMap";
import {Aggregator} from "./aggregator";

export class AggregatorKeeper {
  private readonly logger = Logger.getInstance();
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
    if (this.aggregators.has(queryString)) {
      this.logger.warn("query: \n"+ queryString +" \nalready exists!", "AggregatorKeeper");
    }
    else {
      this.aggregators.set(queryString, new Aggregator(queryString));
      try {
      }
      catch (e) {
        this.logger.error("Didn't register query", "AggregatorKeeper");
      }
    }
  }

  public getAggregator(queryString: String) : Aggregator {
    return this.aggregators.get(queryString);
  }

}
