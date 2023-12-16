import type { Operation, OperationResult } from '../aggregator-services/aggregatorService';
export interface AggregatorServiceRegistry {
    initializeServices: () => Promise<void>;
    run: (operation: Operation) => Promise<OperationResult | undefined>;
}
