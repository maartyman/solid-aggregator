import type { OperationTestResult } from '../service/Service';

export interface CostQueueFactory {
  create: () => CostQueue;
}

export interface CostQueue {
  length: number;
  push: (aggregatorService: OperationTestResult) => void;
  pop: () => OperationTestResult | undefined;
}

export type CostParameters = {
  timeSeconds: number;
};
