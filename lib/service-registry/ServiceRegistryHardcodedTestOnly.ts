import type { IService, Operation, OperationResult } from '../service/IService';
import type { CostQueueFactory } from '../cost-queue/CostQueue';
import type { ServiceRegistry } from './ServiceRegistry';

export class ServiceRegistryHardcodedTestOnly implements ServiceRegistry {
  public readonly costQueueFactory: CostQueueFactory;
  public readonly services: IService[];

  public constructor(aggregatorServices: IService[], costQueueFactory: CostQueueFactory) {
    this.services = aggregatorServices;
    this.costQueueFactory = costQueueFactory;
  }

  public async initializeServices(): Promise<void> {
    await Promise.all(
      this.services.map(
        async(aggregatorService): Promise<void> => aggregatorService.initialize(),
      ),
    );
  }

  public async run(operation: Operation): Promise<OperationResult | undefined> {
    const costQueue = this.costQueueFactory.create();

    await Promise.all(this.services.map(
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

  public get descriptions(): string[] {
    const result = [];
    for (const service of this.services) {
      result.push(service.description);
    }
    return result;
  }
}
