import { StreamParser, StreamWriter } from 'n3';
import { v4 } from 'uuid';
import type { IFetch } from '../fetch/IFetch';
import type { IPod } from '../pod/IPod';
import { AsyncConstructor } from '../core/AsyncConstructor';
import type { IService, Operation, OperationResult, OperationTestResult, ServiceDescription } from './IService';

export class ServiceAggregation extends AsyncConstructor implements IService {
  public fetch: IFetch;
  public pod: IPod;
  private podLocation: string | undefined;

  public constructor(args: ServiceAggregationArgs) {
    super(args);
    this.fetch = args.fetch;
    this.pod = args.pod;
  }

  protected async initialize(args: ServiceAggregationArgs): Promise<void> {
    this.podLocation = await args.pod.newServiceLocation(this.description);
  }

  public async test(operation: Operation): Promise<OperationTestResult> {
    if (operation.operation !== 'Aggregation') {
      throw new Error('Not an aggregation operation');
    }
    return {
      aggregatorService: this,
      operation,
      runnable: true,
    };
  }

  public async run(operation: Operation): Promise<OperationResult> {
    const resultLocation = `${this.podLocation}/${v4()}.ttl`;

    const streamWriter = new StreamWriter();
    for (const source of operation.sources) {
      const streamParser = new StreamParser();
      // eslint-disable-next-line ts/no-unsafe-argument
      (await this.fetch.fetch(source)).body?.pipeThrough(streamParser as any);
      streamParser.pipe(streamWriter);
    }

    await this.fetch.fetch(resultLocation, {
      method: 'PUT',
      body: streamWriter,
      headers: {
        'Content-Type': 'text/turtle', // eslint-disable-line ts/naming-convention
      },
    });

    return {
      aggregatorService: this,
      operation,
      resultLocation,
    };
  }

  public get description(): ServiceDescription {
    return {
      toString: (): string => 'Aggregation',
    };
  }
}

export type ServiceAggregationArgs = {
  fetch: IFetch;
  pod: IPod;
};
