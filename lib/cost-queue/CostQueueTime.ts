import TinyQueue from 'tinyqueue';
import type { OperationTestResult } from '../aggregator-services/aggregatorService';
import type { CostQueue, CostQueueFactory } from './CostQueue';

export class CostQueueTimeFactory implements CostQueueFactory {
  public create(): CostQueue {
    return new CostQueueTime();
  }
}

class CostQueueTime implements CostQueue {
  private readonly priorityQueue: TinyQueue<OperationTestResult>;

  public get length(): number {
    return this.priorityQueue.length;
  }

  public constructor() {
    this.priorityQueue = new TinyQueue([], compare);
  }

  public push(aggregatorService: OperationTestResult): void {
    this.priorityQueue.push(aggregatorService);
  }

  public pop(): OperationTestResult | undefined {
    return this.priorityQueue.pop();
  }
}

function compare(a: OperationTestResult, b: OperationTestResult): number {
  if (a.costParameters === undefined) {
    if (b.costParameters === undefined) {
      return 0;
    }
    return -1;
  }
  if (b.costParameters === undefined) {
    return 1;
  }
  return a.costParameters.timeSeconds - b.costParameters.timeSeconds;
}
