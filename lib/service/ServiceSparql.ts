import type { Operation, OperationResult, OperationTestResult, Service } from './Service';

export class ServiceSparql implements Service {
  public async initialize(): Promise<void> {
    return undefined;
  }

  public async test(operation: Operation): Promise<OperationTestResult> {
    return {
      aggregatorService: this,
      operation,
      runnable: true,
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
