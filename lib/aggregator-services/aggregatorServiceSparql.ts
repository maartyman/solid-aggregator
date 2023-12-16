import type { AggregatorService, Operation, OperationResult, OperationTestResult } from './aggregatorService';

export class AggregatorServiceSPARQL implements AggregatorService {
  public async initialize(): Promise<void> {
    return undefined;
  }

  public async test(operation: Operation): Promise<OperationTestResult> {
    return {
      aggregatorService: this,
      operation,
      runnable: false,
    };
  }

  public async run(operation: Operation): Promise<OperationResult> {
    return {
      aggregatorService: this,
      operation,
      resultLocation: '',
    };
  }

  public get description(): string {
    return 'SPARQL';
  }
}
