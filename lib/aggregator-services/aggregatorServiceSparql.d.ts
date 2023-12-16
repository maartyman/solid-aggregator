import type { AggregatorService, Operation, OperationResult, OperationTestResult } from './aggregatorService';
export declare class AggregatorServiceSPARQL implements AggregatorService {
    initialize(): Promise<void>;
    test(operation: Operation): Promise<OperationTestResult>;
    run(operation: Operation): Promise<OperationResult>;
    get description(): string;
}
