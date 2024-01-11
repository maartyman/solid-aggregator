import type { IOperation, IOperationResult, IOperationTestResult, IService } from './IService';

export class ServiceSparql implements IService {
  public async initialize(): Promise<void> {
    return undefined;
  }

  public async test(operation: IOperation): Promise<IOperationTestResult> {
    return {
      aggregatorService: this,
      operation,
      runnable: true,
    };
  }

  public async run(operation: IOperation): Promise<IOperationResult> {
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
