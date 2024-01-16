import { CostQueueTimeFactory } from '../CostQueueTime';
import type { ICostQueue } from '../ICostQueue';

describe('CostQueueTimeFactory', (): void => {
  let costQueueTimeFactory: CostQueueTimeFactory;

  beforeEach((): void => {
    costQueueTimeFactory = new CostQueueTimeFactory();
  });

  it('should create a ICostQueue.', (): void => {
    expect(costQueueTimeFactory.create().constructor.name).toBe('CostQueueTime');
  });

  describe('CostQueueTime', (): void => {
    let costQueueTime: ICostQueue;

    beforeEach((): void => {
      costQueueTime = costQueueTimeFactory.create();
    });

    it('should push.', (): void => {
      costQueueTime.push(({} as any));
    });

    it('should push and pop.', (): void => {
      const aggregatorService = {} as any;
      costQueueTime.push(aggregatorService);
      expect(costQueueTime.pop()).toEqual(aggregatorService);
    });

    it('should have length.', (): void => {
      const aggregatorService = {} as any;
      costQueueTime.push(aggregatorService);
      expect(costQueueTime).toHaveLength(1);
      costQueueTime.push(aggregatorService);
      expect(costQueueTime).toHaveLength(2);
      costQueueTime.push(aggregatorService);
      expect(costQueueTime).toHaveLength(3);
    });

    it('should pop based on timeSeconds.', (): void => {
      const aggregatorService1 = {
        costParameters: {
          timeSeconds: 2,
        },
      } as any;
      const aggregatorService2 = {
        costParameters: {
          timeSeconds: 3,
        },
      } as any;
      const aggregatorService3 = {
        costParameters: {
          timeSeconds: 1,
        },
      } as any;
      costQueueTime.push(aggregatorService1);
      costQueueTime.push(aggregatorService2);
      costQueueTime.push(aggregatorService3);
      expect(costQueueTime.pop()).toEqual(aggregatorService3);
      expect(costQueueTime.pop()).toEqual(aggregatorService1);
      expect(costQueueTime.pop()).toEqual(aggregatorService2);
    });

    it('should handle undefs.', (): void => {
      const aggregatorService1 = {
        costParameters: {
          timeSeconds: undefined,
        },
      } as any;
      const aggregatorService2 = {
        costParameters: 1,
      } as any;
      const aggregatorService3 = {
        costParameters: undefined,
      } as any;
      costQueueTime.push(aggregatorService1);
      costQueueTime.push(aggregatorService2);
      costQueueTime.push(aggregatorService3);
      expect(costQueueTime.pop()).toEqual(aggregatorService2);
    });
  });
});
