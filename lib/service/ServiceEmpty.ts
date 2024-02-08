import { AsyncConstructor } from '../core/AsyncConstructor';
import type { IPod } from '../pod/IPod';
import type { IFetch } from '../fetch/IFetch';
import type { IService, Operation, OperationResult, OperationTestResult, ServiceDescription } from './IService';
import type { ServiceAggregationArgs } from './ServiceAggregation';

export class ServiceEmpty extends AsyncConstructor implements IService {
  private podLocation: string | undefined;
  public fetch: IFetch;
  public pod: IPod;

  public constructor(args: ServiceAggregationArgs) {
    super(args);
    this.fetch = args.fetch;
    this.pod = args.pod;
  }

  protected async initialize(args: ServiceAggregationArgs): Promise<void> {
    this.podLocation = await args.pod.newServiceLocation(this.description);
  }

  public async test(operation: Operation): Promise<OperationTestResult> {
    if (operation.operation !== 'Empty') {
      throw new Error('Not a Empty operation');
    }
    return {
      aggregatorService: this,
      operation,
      runnable: true,
    };
  }

  public async run(operation: Operation): Promise<OperationResult> {
    return {
      aggregatorService: this,
      operation,
      resultLocation: '',
    };
  }

  public get description(): ServiceDescription {
    return {
      toString: (): string => 'Empty',
    };
  }
}

export type ServiceEmptyArgs = {
  fetch: IFetch;
  pod: IPod;
};
