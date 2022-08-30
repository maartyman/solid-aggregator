import {Logger} from "../utils/logger";
import {CustomMap} from "../utils/customMap";
import {Aggregator} from "./aggregator";
import {QueryExplanation} from "./queryExplanation";
import { v4 as uuidv4 } from 'uuid';
import {arrayEquality} from "../utils/generalUtils";
import {GuardingConfig} from "../utils/guardingConfig";

export class AggregatorKeeper {
  private readonly logger = Logger.getInstance();
  private static instance: AggregatorKeeper | null;
  private aggregators;

  public readonly guardingConfig: GuardingConfig;

  constructor(guardingConfig: GuardingConfig) {
    /*
    TODO make a better searchable store that links query strings to n3 stores
    */
    this.guardingConfig = guardingConfig;

    this.aggregators = new CustomMap();
  }

  static setInstance(guardingConfig: GuardingConfig) {
    if (this.instance == null) {
      this.instance = new AggregatorKeeper(guardingConfig);
    }
    return this.instance;
  }

  static getInstance() {
    if (this.instance == null) {
      this.instance = new AggregatorKeeper(GuardingConfig.default);
      Logger.getInstance().error("AggregatorKeeper was not instantiated, instantiating it now with default values.", this);
    }
    return this.instance;
  }

  public addAggregator(queryExplanation: QueryExplanation) : Aggregator {
    let aggregator: Aggregator | undefined;
    for (const tempAggregator of this.aggregators.values()) {
      if (!(tempAggregator.queryExplanation.queryString === queryExplanation.queryString)) {
        this.logger.debug("queryString", "AggregatorKeeper");
        continue;
      }
      else if (!arrayEquality(tempAggregator.queryExplanation.sources, queryExplanation.sources)) {
        this.logger.debug("sources", "AggregatorKeeper");
        continue;
      }
      else if (!(tempAggregator.queryExplanation.comunicaContext === queryExplanation.comunicaContext)) {
        this.logger.debug("context", "AggregatorKeeper");
        continue;
      }
      else if (!(tempAggregator.queryExplanation.reasoningRules === queryExplanation.reasoningRules)) {
        this.logger.debug("reasoningRules", "AggregatorKeeper");
        continue;
      }
      else if (!(tempAggregator.queryExplanation.comunicaVersion === queryExplanation.comunicaVersion)) {
        this.logger.debug("comunicaVersion", "AggregatorKeeper");
        continue;
      }
      else if (tempAggregator.queryExplanation.lenient != queryExplanation.lenient) {
        this.logger.debug("lenient", "AggregatorKeeper");
        continue;
      }
      aggregator = tempAggregator;
      break;
    }
    if (aggregator) {
      this.logger.warn("query: \n"+ JSON.stringify(queryExplanation) +" \nalready exists!", "AggregatorKeeper");
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

}
