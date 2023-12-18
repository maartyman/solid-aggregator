import type { CostParameters } from '../cost-queue/CostQueue';

export interface Service {
  get description(): string;
  initialize: () => Promise<void>;
  test: (operation: Operation) => Promise<OperationTestResult>;
  run: (operation: Operation) => Promise<OperationResult | undefined>;
}

export interface OperationTestResult {
  aggregatorService: Service;
  operation: Operation;
  runnable: boolean;
  operationResult?: OperationResult;
  costParameters?: CostParameters;
}

export interface OperationResult {
  aggregatorService: Service;
  operation: Operation;
  resultLocation: string;
}

export interface Operation {
  operation: string;
  sources: string[];
}
