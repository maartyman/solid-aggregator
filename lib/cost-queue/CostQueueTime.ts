import TinyQueue from 'tinyqueue';
import type { IOperationTestResult } from '../service/IService';
import type { ICostQueue, ICostQueueFactory } from './ICostQueue';

export class CostQueueTimeFactory implements ICostQueueFactory {
  public create(): ICostQueue {
    return new CostQueueTime();
  }
}

class CostQueueTime implements ICostQueue {
  private readonly priorityQueue: TinyQueue<IOperationTestResult>;

  public get length(): number {
    return this.priorityQueue.length;
  }

  public constructor() {
    this.priorityQueue = new TinyQueue([], compare);
  }

  public push(aggregatorService: IOperationTestResult): void {
    this.priorityQueue.push(aggregatorService);
  }

  public pop(): IOperationTestResult | undefined {
    return this.priorityQueue.pop();
  }
}

function compare(a: IOperationTestResult, b: IOperationTestResult): number {
  if (a.costParameters === undefined) {
    if (b.costParameters === undefined) {
      return 0;
    }
    return 1;
  }
  if (b.costParameters === undefined) {
    return -1;
  }
  return a.costParameters.timeSeconds - b.costParameters.timeSeconds;
}
