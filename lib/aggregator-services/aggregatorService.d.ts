import type { CostParameters } from '../cost-queue/CostQueue';
export interface AggregatorService {
    get description(): string;
    initialize: () => Promise<void>;
    test: (operation: Operation) => Promise<OperationTestResult>;
    run: (operation: Operation) => Promise<OperationResult | undefined>;
}
export interface OperationTestResult {
    aggregatorService: AggregatorService;
    operation: Operation;
    runnable: boolean;
    operationResult?: OperationResult;
    costParameters?: CostParameters;
}
export interface OperationResult {
    aggregatorService: AggregatorService;
    operation: Operation;
    resultLocation: string;
}
export interface Operation {
    id: string;
    operation: string;
    sources: string[];
}
