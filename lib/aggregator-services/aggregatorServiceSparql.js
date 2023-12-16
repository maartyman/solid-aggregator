"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorServiceSPARQL = void 0;
class AggregatorServiceSPARQL {
    async initialize() {
        return undefined;
    }
    async test(operation) {
        return {
            aggregatorService: this,
            operation,
            runnable: false,
        };
    }
    async run(operation) {
        return {
            aggregatorService: this,
            operation,
            resultLocation: '',
        };
    }
    get description() {
        return 'SPARQL';
    }
}
exports.AggregatorServiceSPARQL = AggregatorServiceSPARQL;
//# sourceMappingURL=aggregatorServiceSparql.js.map