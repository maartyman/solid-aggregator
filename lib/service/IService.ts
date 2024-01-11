import type { CostParameters } from '../cost-queue/ICostQueue';

export interface IService {
  get description(): string;
  initialize: () => Promise<void>;
  test: (operation: IOperation) => Promise<IOperationTestResult>;
  run: (operation: IOperation) => Promise<IOperationResult | undefined>;
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
