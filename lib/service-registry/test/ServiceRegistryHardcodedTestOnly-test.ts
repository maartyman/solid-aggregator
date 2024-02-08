import { ServiceRegistryHardcodedTestOnly } from '../ServiceRegistryHardcodedTestOnly';
import type { IOperation, IOperationTestResult, IService } from '../../service/IService';
import type { ICostQueueFactory } from '../../cost-queue/ICostQueue';

describe('ServiceRegistryHardcodedTestOnly', (): void => {
  let serviceRegistry: ServiceRegistryHardcodedTestOnly;
  let mockAggregatorServices: IService[];
  let mockCostQueueFactory: ICostQueueFactory;

  beforeEach((): void => {
    mockAggregatorServices = [
      ({
        subscribeInitialized: jest.fn(
          (resolve): void => {
            resolve();
          },
        ),
        test: jest.fn(),
        description: {
          toString: (): string => 'Service1',
        },
      } as any) as IService,
      ({
        subscribeInitialized: jest.fn(
          (resolve): void => {
            resolve();
          },
        ),
        test: jest.fn(),
        description: {
          toString: (): string => 'Service2',
        },
      } as any) as IService,
    ];

    mockCostQueueFactory = {
      create: jest.fn(),
    } as any;

    serviceRegistry = new ServiceRegistryHardcodedTestOnly(mockAggregatorServices, mockCostQueueFactory);
  });

  describe('initializeServices', (): void => {
    it('should initialize all services.', async(): Promise<void> => {
      await serviceRegistry.initializeServices();
      for (const service of mockAggregatorServices) {
        expect(service.subscribeInitialized).toHaveBeenCalledWith(expect.any(Function));
      }
    });
  });

  describe('run', (): void => {
    it('should run operation and return operation result.', async(): Promise<void> => {
      const mockOperation: IOperation = {} as any;
      const mockOperationTestResult: IOperationTestResult = {
        operationResult: {} as any,
      } as any;

      // Mock costQueue methods
      const mockCostQueuePush = jest.fn();
      const mockCostQueuePop = jest.fn((): IOperationTestResult => mockOperationTestResult);
      jest.spyOn(mockCostQueueFactory, 'create').mockImplementation().mockReturnValue({
        push: mockCostQueuePush,
        pop: mockCostQueuePop,
        length: 1,
      });

      // Mock test results
      for (const service of mockAggregatorServices) {
        jest.spyOn(service, 'test').mockImplementation().mockResolvedValue({ runnable: true } as any);
      }

      const result = await serviceRegistry.run(mockOperation);

      expect(result).toBe(mockOperationTestResult.operationResult);
      expect(mockCostQueueFactory.create).toHaveBeenCalledTimes(1);
      expect(mockAggregatorServices[0].test).toHaveBeenCalledWith(mockOperation);
      expect(mockAggregatorServices[1].test).toHaveBeenCalledWith(mockOperation);
      expect(mockCostQueuePush).toHaveBeenCalledWith({ runnable: true });
      expect(mockCostQueuePush).toHaveBeenCalledTimes(2);
      expect(mockCostQueuePop).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if no runnable operation result.', async(): Promise<void> => {
      const mockOperation: IOperation = {} as any;

      // Mock costQueue methods
      const mockCostQueuePush = jest.fn();
      const mockCostQueuePop = jest.fn((): undefined => undefined);
      jest.spyOn(mockCostQueueFactory, 'create').mockImplementation().mockReturnValue({
        push: mockCostQueuePush,
        pop: mockCostQueuePop,
        length: 0,
      });

      // Mock test results
      for (const service of mockAggregatorServices) {
        jest.spyOn(service, 'test').mockImplementation().mockResolvedValue({ runnable: false } as any);
      }

      const result = await serviceRegistry.run(mockOperation);

      expect(result).toBeUndefined();
      expect(mockCostQueueFactory.create).toHaveBeenCalledTimes(1);
      expect(mockAggregatorServices[0].test).toHaveBeenCalledWith(mockOperation);
      expect(mockAggregatorServices[1].test).toHaveBeenCalledWith(mockOperation);
      expect(mockCostQueuePush).toHaveBeenCalledTimes(0);
      expect(mockCostQueuePop).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if one is runnable but has operationResult is undefined.', async(): Promise<void> => {
      const mockOperation: IOperation = {} as any;
      const mockOperationTestResult: IOperationTestResult = {
        operationResult: undefined,
      } as any;

      const costQueue = {
        push: {} as any,
        pop: {} as any,
        length: 2,
      };
      // Mock costQueue methods
      const mockCostQueuePush = jest.fn();
      const mockCostQueuePop = jest.fn((): IOperationTestResult => {
        costQueue.length -= 1;
        return mockOperationTestResult;
      });
      costQueue.push = mockCostQueuePush;
      costQueue.pop = mockCostQueuePop;
      jest.spyOn(mockCostQueueFactory, 'create').mockImplementation().mockReturnValue(costQueue);

      // Mock test results
      for (const service of mockAggregatorServices) {
        jest.spyOn(service, 'test').mockImplementation().mockResolvedValue({ runnable: true } as any);
      }

      const result = await serviceRegistry.run(mockOperation);

      expect(result).toBeUndefined();
      expect(mockCostQueueFactory.create).toHaveBeenCalledTimes(1);
      expect(mockAggregatorServices[0].test).toHaveBeenCalledWith(mockOperation);
      expect(mockAggregatorServices[1].test).toHaveBeenCalledWith(mockOperation);
      expect(mockCostQueuePush).toHaveBeenCalledWith({ runnable: true });
      expect(mockCostQueuePush).toHaveBeenCalledTimes(2);
      expect(mockCostQueuePop).toHaveBeenCalledTimes(2);
    });
  });

  describe('descriptions', (): void => {
    it('should return descriptions of all services.', (): void => {
      const descriptions = serviceRegistry.descriptions;
      expect(descriptions).toEqual([ 'Service1', 'Service2' ]);
    });
  });
});
