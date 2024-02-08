import { AsyncConstructor } from '../core/AsyncConstructor';
import type { IPod } from '../pod/IPod';
import type { IFetch } from '../fetch/IFetch';
import type { IOperation, IOperationResult, IOperationTestResult, IService, IServiceDescription } from './IService';

export class ServiceEmpty extends AsyncConstructor implements IService {
  private podLocation: string | undefined;
  public fetch: IFetch;
  public pod: IPod;

  public constructor(args: ServiceEmptyArgs) {
    super(args);
    this.fetch = args.fetch;
    this.pod = args.pod;
  }

  protected async initialize(args: ServiceEmptyArgs): Promise<void> {
    this.podLocation = await args.pod.newServiceLocation(this.description);
  }

  public async test(operation: IOperation): Promise<IOperationTestResult> {
    if (operation.operation !== 'Empty') {
      throw new Error('Not a Empty operation');
    }
    return {
      aggregatorService: this,
      operation,
      runnable: true,
    };
  }

  public async run(operation: IOperation): Promise<IOperationResult> {
    return {
      aggregatorService: this,
      operation,
      resultLocation: '',
    };
  }

  public get description(): IServiceDescription {
    return {
      toString: (): string => 'Empty',
    };
  }
}

export type ServiceEmptyArgs = {
  fetch: IFetch;
  pod: IPod;
};
