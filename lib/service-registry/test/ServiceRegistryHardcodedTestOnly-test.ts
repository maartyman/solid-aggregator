import {ServiceRegistryHardcodedTestOnly} from "../ServiceRegistryHardcodedTestOnly";
import {IOperation, IOperationResult, IOperationTestResult, IService} from "../../service/IService";
import {ICostQueueFactory} from "../../cost-queue/ICostQueue";

describe('ServiceRegistryHardcodedTestOnly', () => {
  let serviceRegistry: ServiceRegistryHardcodedTestOnly;
  let mockAggregatorServices: IService[];
  let mockCostQueueFactory: ICostQueueFactory;

  beforeEach(() => {
    mockAggregatorServices = [
      <any>{ initialize: jest.fn(), test: jest.fn(), description: 'Service1' } as IService,
      <any>{ initialize: jest.fn(), test: jest.fn(), description: 'Service2' } as IService,
    ];

    mockCostQueueFactory = <any>{
      create: jest.fn(),
    };

    serviceRegistry = new ServiceRegistryHardcodedTestOnly(mockAggregatorServices, mockCostQueueFactory);
  });

  describe('initializeServices', () => {
    it('should initialize all services', async () => {
      await serviceRegistry.initializeServices();
      mockAggregatorServices.forEach((service) => {
        expect(service.initialize).toHaveBeenCalled();
      });
    });
  });

  describe('run', () => {
    it('should run operation and return operation result', async () => {
      const mockOperation: IOperation = <any>{};
      const mockOperationTestResult: IOperationTestResult = <any>{
        operationResult: <any>{}
      };

      // Mock costQueue methods
      const mockCostQueuePush = jest.fn();
      const mockCostQueuePop = jest.fn(() => mockOperationTestResult);
      mockCostQueueFactory.create = jest.fn().mockReturnValue({
        push: mockCostQueuePush,
        pop: mockCostQueuePop,
        length: 1,
      });

      // Mock test results
      mockAggregatorServices.forEach((service) => {
        service.test = jest.fn().mockResolvedValue({ runnable: true });
      });

      const result = await serviceRegistry.run(mockOperation);

      expect(result).toBe(mockOperationTestResult.operationResult);
      expect(mockCostQueueFactory.create).toHaveBeenCalledTimes(1);
      expect(mockAggregatorServices[0].test).toHaveBeenCalledWith(mockOperation);
      expect(mockAggregatorServices[1].test).toHaveBeenCalledWith(mockOperation);
      expect(mockCostQueuePush).toHaveBeenCalledWith({ runnable: true });
      expect(mockCostQueuePush).toHaveBeenCalledTimes(2);
      expect(mockCostQueuePop).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if no runnable operation result', async () => {
      const mockOperation: IOperation = <any>{};

      // Mock costQueue methods
      const mockCostQueuePush = jest.fn();
      const mockCostQueuePop = jest.fn(() => undefined);
      mockCostQueueFactory.create = jest.fn().mockReturnValue({
        push: mockCostQueuePush,
        pop: mockCostQueuePop,
        length: 0,
      });

      // Mock test results
      mockAggregatorServices.forEach((service) => {
        service.test = jest.fn().mockResolvedValue({ runnable: false });
      });

      const result = await serviceRegistry.run(mockOperation);

      expect(result).toBe(undefined);
      expect(mockCostQueueFactory.create).toHaveBeenCalledTimes(1);
      expect(mockAggregatorServices[0].test).toHaveBeenCalledWith(mockOperation);
      expect(mockAggregatorServices[1].test).toHaveBeenCalledWith(mockOperation);
      expect(mockCostQueuePush).toHaveBeenCalledTimes(0);
      expect(mockCostQueuePop).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if one is runnable but has operationResult is undefined', async () => {
      const mockOperation: IOperation = <any>{};
      const mockOperationTestResult: IOperationTestResult = <any>{
        operationResult: undefined
      };

      let costQueue = {
        push: <any>{},
        pop: <any>{},
        length: 2,
      }
      // Mock costQueue methods
      const mockCostQueuePush = jest.fn();
      const mockCostQueuePop = jest.fn(() => {
        costQueue.length--;
        return mockOperationTestResult
      });
      costQueue.push = mockCostQueuePush;
      costQueue.pop = mockCostQueuePop;
      mockCostQueueFactory.create = jest.fn().mockReturnValue(costQueue);

      // Mock test results
      mockAggregatorServices.forEach((service) => {
        service.test = jest.fn().mockResolvedValue({ runnable: true });
      });

      const result = await serviceRegistry.run(mockOperation);

      expect(result).toBe(undefined);
      expect(mockCostQueueFactory.create).toHaveBeenCalledTimes(1);
      expect(mockAggregatorServices[0].test).toHaveBeenCalledWith(mockOperation);
      expect(mockAggregatorServices[1].test).toHaveBeenCalledWith(mockOperation);
      expect(mockCostQueuePush).toHaveBeenCalledWith({ runnable: true });
      expect(mockCostQueuePush).toHaveBeenCalledTimes(2);
      expect(mockCostQueuePop).toHaveBeenCalledTimes(2);
    });
  });

  describe('descriptions', () => {
    it('should return descriptions of all services', () => {
      const descriptions = serviceRegistry.descriptions;
      expect(descriptions).toEqual(['Service1', 'Service2']);
    });
  });
});
