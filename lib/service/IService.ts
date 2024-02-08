import type { CostParameters } from '../cost-queue/CostQueue';
import type { IAsyncConstructor } from '../core/AsyncConstructor';

export interface IService extends IAsyncConstructor {
  get description(): ServiceDescription;
  test: (operation: Operation) => Promise<OperationTestResult>;
  run: (operation: Operation) => Promise<OperationResult | undefined>;
}

export interface ServiceDescription {
  toString: () => string;
}

export interface OperationTestResult {
  aggregatorService: IService;
  operation: Operation;
  runnable: boolean;
  operationResult?: OperationResult;
  costParameters?: CostParameters;
}

export interface OperationResult {
  aggregatorService: IService;
  operation: Operation;
  resultLocation: string;
}

export interface Operation {
  operation: string;
  sources: string[];
}
