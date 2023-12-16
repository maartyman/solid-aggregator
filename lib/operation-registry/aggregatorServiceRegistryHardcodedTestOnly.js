"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorServiceRegistryHardcodedTestOnly = void 0;
class AggregatorServiceRegistryHardcodedTestOnly {
    costQueueFactory;
    aggregatorServices;
    constructor(aggregatorServices, costQueueFactory) {
        this.aggregatorServices = aggregatorServices;
        this.costQueueFactory = costQueueFactory;
    }
    async initializeServices() {
        await Promise.all(this.aggregatorServices.map(async (aggregatorService) => aggregatorService.initialize()));
    }
    async run(operation) {
        const costQueue = this.costQueueFactory.create();
        await Promise.all(this.aggregatorServices.map(async (aggregatorService) => aggregatorService.test(operation).then((testResult) => {
            if (testResult.runnable) {
                costQueue.push(testResult);
            }
        })));
        let operationResult = costQueue.pop();
        while (operationResult === undefined || operationResult.operationResult === undefined) {
            if (costQueue.length === 0) {
                return undefined;
            }
            operationResult = costQueue.pop();
        }
        return operationResult.operationResult;
    }
}
exports.AggregatorServiceRegistryHardcodedTestOnly = AggregatorServiceRegistryHardcodedTestOnly;
//# sourceMappingURL=aggregatorServiceRegistryHardcodedTestOnly.js.map