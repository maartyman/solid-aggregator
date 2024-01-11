import type { IOperationTestResult } from '../service/IService';

export interface ICostQueueFactory {
  create: () => ICostQueue;
}

export interface ICostQueue {
  length: number;
  push: (aggregatorService: IOperationTestResult) => void;
  pop: () => IOperationTestResult | undefined;
}

export type CostParameters = {
  timeSeconds: number;
};
