
import {CustomMap} from "../utils/customMap";
import {Aggregator} from "./aggregator";
import {QueryExplanation} from "./queryExplanation";
import { v4 as uuidv4 } from 'uuid';
import {arrayEquality} from "../utils/generalUtils";
import {GuardingConfig} from "../utils/guardingConfig";
import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";

export class AggregatorKeeper {
  private readonly logger = new Logger(loggerSettings);
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
      new Logger(loggerSettings).error("AggregatorKeeper was not instantiated, instantiating it now with default values.", this);
    }
    return this.instance;
  }

  public addAggregator(queryExplanation: QueryExplanation) : Aggregator {
    let aggregator: Aggregator | undefined;
    for (const tempAggregator of this.aggregators.values()) {
      if (!(tempAggregator.queryExplanation.queryString === queryExplanation.queryString)) {
        this.logger.debug("queryString");
        continue;
      }
      else if (!arrayEquality(tempAggregator.queryExplanation.sources, queryExplanation.sources)) {
        this.logger.debug("sources");
        continue;
      }
      else if (!(tempAggregator.queryExplanation.comunicaContext === queryExplanation.comunicaContext)) {
        this.logger.debug("context");
        continue;
      }
      else if (!(tempAggregator.queryExplanation.reasoningRules === queryExplanation.reasoningRules)) {
        this.logger.debug("reasoningRules");
        continue;
      }
      else if (!(tempAggregator.queryExplanation.comunicaVersion === queryExplanation.comunicaVersion)) {
        this.logger.debug("comunicaVersion");
        continue;
      }
      else if (tempAggregator.queryExplanation.lenient != queryExplanation.lenient) {
        this.logger.debug("lenient");
        continue;
      }
      aggregator = tempAggregator;
      break;
    }
    if (aggregator) {
      this.logger.warn("query: \n"+ JSON.stringify(queryExplanation) +" \nalready exists!");
      return aggregator;
    }
    else {
      const UUID = uuidv4();
      aggregator = new Aggregator(queryExplanation, UUID);
      this.aggregators.set(UUID, aggregator);
      return aggregator;
    }
  }

  public getAggregator(UUID: String) : Aggregator {
    return this.aggregators.get(UUID);
  }

  //TODO remove aggregator
}
