import type { AggregatorService, Operation, OperationResult } from '../aggregator-services/aggregatorService';
import type { CostQueueFactory } from '../cost-queue/CostQueue';
import type { AggregatorServiceRegistry } from './aggregatorServiceRegistry';
export declare class AggregatorServiceRegistryHardcodedTestOnly implements AggregatorServiceRegistry {
    readonly costQueueFactory: CostQueueFactory;
    readonly aggregatorServices: AggregatorService[];
    constructor(aggregatorServices: AggregatorService[], costQueueFactory: CostQueueFactory);
    initializeServices(): Promise<void>;
    run(operation: Operation): Promise<OperationResult | undefined>;
}
