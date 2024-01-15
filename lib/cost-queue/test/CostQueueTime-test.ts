import {CostQueueTimeFactory} from "../CostQueueTime";
import { ICostQueue } from "../ICostQueue";

describe("CostQueueTimeFactory", () => {
  let costQueueTimeFactory: CostQueueTimeFactory;

  beforeEach(() => {
    costQueueTimeFactory = new CostQueueTimeFactory();
  });

  it('should create a ICostQueue', () => {
    expect(costQueueTimeFactory.create().constructor.name).toEqual("CostQueueTime");
  });

  describe("CostQueueTime", () => {
    let costQueueTime: ICostQueue;

    beforeEach(() => {
      costQueueTime = costQueueTimeFactory.create();
    });

    it('should push', () => {
      costQueueTime.push(<any>{});
    });

    it('should push and pop', () => {
      let aggregatorService = <any>{};
      costQueueTime.push(aggregatorService);
      expect(costQueueTime.pop()).toEqual(aggregatorService);
    });

    it('should have length', () => {
      let aggregatorService = <any>{};
      costQueueTime.push(aggregatorService);
      expect(costQueueTime.length).toEqual(1);
      costQueueTime.push(aggregatorService);
      expect(costQueueTime.length).toEqual(2);
      costQueueTime.push(aggregatorService);
      expect(costQueueTime.length).toEqual(3);
    });

    it('should pop based on timeSeconds', () => {
      let aggregatorService1 = <any>{
        "costParameters": {
          "timeSeconds": 2
        }
      };
      let aggregatorService2 = <any>{
        "costParameters": {
          "timeSeconds": 3
        }
      };
      let aggregatorService3 = <any>{
        "costParameters": {
          "timeSeconds": 1
        }
      };
      costQueueTime.push(aggregatorService1);
      costQueueTime.push(aggregatorService2);
      costQueueTime.push(aggregatorService3);
      expect(costQueueTime.pop()).toEqual(aggregatorService3);
      expect(costQueueTime.pop()).toEqual(aggregatorService1);
      expect(costQueueTime.pop()).toEqual(aggregatorService2);
    });

    it('should handle undefs', () => {
      let aggregatorService1 = <any>{
        "costParameters": {
          "timeSeconds": undefined
        }
      };
      let aggregatorService2 = <any>{
        "costParameters": 1
      };
      let aggregatorService3 = <any>{
        "costParameters": undefined
      };
      costQueueTime.push(aggregatorService1);
      costQueueTime.push(aggregatorService2);
      costQueueTime.push(aggregatorService3);
      expect(costQueueTime.pop()).toEqual(aggregatorService2);
    });
  });
});
