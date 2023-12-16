import type { AggregatorService, Operation, OperationResult } from '../aggregator-services/aggregatorService';
import type { CostQueueFactory } from '../cost-queue/CostQueue';
import type { AggregatorServiceRegistry } from './aggregatorServiceRegistry';

export class AggregatorServiceRegistryHardcodedTestOnly implements AggregatorServiceRegistry {
  public readonly costQueueFactory: CostQueueFactory;
  public readonly aggregatorServices: AggregatorService[];

  public constructor(aggregatorServices: AggregatorService[], costQueueFactory: CostQueueFactory) {
    this.aggregatorServices = aggregatorServices;
    this.costQueueFactory = costQueueFactory;
  }

  public async initializeServices(): Promise<void> {
    await Promise.all(
      this.aggregatorServices.map(
        async(aggregatorService): Promise<void> => aggregatorService.initialize(),
      ),
    );
  }

  public async run(operation: Operation): Promise<OperationResult | undefined> {
    const costQueue = this.costQueueFactory.create();

    await Promise.all(this.aggregatorServices.map(
      async(aggregatorService): Promise<void> => aggregatorService.test(operation).then(
        (testResult): void => {
          if (testResult.runnable) {
            costQueue.push(testResult);
          }
        },
      ),
    ));

    let operationResult = costQueue.pop();
    while (operationResult === undefined || operationResult.operationResult === undefined) {
      if (costQueue.length === 0) {
        return undefined;
      }
      operationResult = costQueue.pop();
    }

    return operationResult.operationResult;
  }
}
