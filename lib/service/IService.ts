import type { CostParameters } from '../cost-queue/ICostQueue';
import type { IAsyncConstructor } from '../core/AsyncConstructor';

export interface IService extends IAsyncConstructor {
  get description(): IServiceDescription;
  test: (operation: IOperation) => Promise<IOperationTestResult>;
  run: (operation: IOperation) => Promise<IOperationResult | undefined>;
}

export interface IServiceDescription {
  toString: () => string;
}

export interface IOperationTestResult {
  aggregatorService: IService;
  operation: IOperation;
  runnable: boolean;
  operationResult?: IOperationResult;
  costParameters?: CostParameters;
}

export interface IOperationResult {
  aggregatorService: IService;
  operation: IOperation;
  resultLocation: string;
}

export interface IOperation {
  operation: string;
  sources: string[];
}
