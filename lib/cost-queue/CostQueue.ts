import type { OperationTestResult } from '../aggregator-services/aggregatorService';

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
