"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorKeeper = void 0;
const customMap_1 = require("../utils/customMap");
const aggregator_1 = require("./aggregator");
const uuid_1 = require("uuid");
const generalUtils_1 = require("../utils/generalUtils");
const guardingConfig_1 = require("../utils/guardingConfig");
const tslog_1 = require("tslog");
const loggerSettings_1 = require("../utils/loggerSettings");
class AggregatorKeeper {
    constructor(guardingConfig) {
        this.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        /*
        TODO make a better searchable store that links query strings to n3 stores
        */
        this.guardingConfig = guardingConfig;
        this.aggregators = new customMap_1.CustomMap();
    }
    static setInstance(guardingConfig) {
        if (this.instance == null) {
            this.instance = new AggregatorKeeper(guardingConfig);
        }
        return this.instance;
    }
    static getInstance() {
        if (this.instance == null) {
            this.instance = new AggregatorKeeper(guardingConfig_1.GuardingConfig.default);
            new tslog_1.Logger(loggerSettings_1.loggerSettings).error("AggregatorKeeper was not instantiated, instantiating it now with default values.", this);
        }
        return this.instance;
    }
    addAggregator(queryExplanation) {
        let aggregator;
        for (const tempAggregator of this.aggregators.values()) {
            if (!(tempAggregator.queryExplanation.queryString === queryExplanation.queryString)) {
                this.logger.debug("queryString");
                continue;
            }
            else if (!(0, generalUtils_1.arrayEquality)(tempAggregator.queryExplanation.sources, queryExplanation.sources)) {
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
            this.logger.warn("query: \n" + JSON.stringify(queryExplanation) + " \nalready exists!");
            return aggregator;
        }
        else {
            const UUID = (0, uuid_1.v4)();
            aggregator = new aggregator_1.Aggregator(queryExplanation, UUID);
            this.aggregators.set(UUID, aggregator);
            return aggregator;
        }
    }
    getAggregator(UUID) {
        return this.aggregators.get(UUID);
    }
}
exports.AggregatorKeeper = AggregatorKeeper;
