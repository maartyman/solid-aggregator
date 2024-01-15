import {Endpoint, IEndpointHandler} from "../Endpoint";
import {IServiceRegistry} from "../../service-registry/IServiceRegistry";
import {IOperation} from "../../service/IService";

describe("Endpoint", () => {
  let serviceRegistry: IServiceRegistry;
  let endpointHandlers: IEndpointHandler[];
  let endpoint: Endpoint;

  afterEach(async () => {
    await new Promise<void>(resolve => (<any>endpoint).httpServer.close(() => {
      resolve();
    }));
  });

  describe('with basic serviceRegistry', () => {
    beforeEach(() => {
      serviceRegistry = {
        initializeServices: jest.fn().mockReturnValue(Promise.resolve()),
        descriptions: <any>jest.fn().mockReturnValue([
          "testDescription"
        ]),
        run: jest.fn(
          (operation: IOperation) => {
            return Promise.resolve(undefined)
          }
        )
      };
    });

    it('should test multiple endpointHandlers and run the fastest', async () => {
      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>(resolve => {
            setTimeout(() => {
              resolve(true);
            }, 500);
          })),
          run: jest.fn().mockReturnValue(Promise.resolve()),
        },
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>(resolve => {
            setTimeout(() => {
              resolve(true);
            }, 100);
          })),
          run: jest.fn().mockReturnValue(Promise.resolve()),
        }
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      expect((await fetch("http://localhost:1612")).ok).toEqual(true);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(0);
      expect(endpointHandlers[1].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[1].run).toHaveBeenCalledTimes(1);
    });

    it('should test multiple endpointHandlers and not run the undefined', async () => {
      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>(resolve => {
            resolve(false);
          })),
          run: jest.fn().mockReturnValue(Promise.resolve()),
        },
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>(resolve => {
            setTimeout(() => {
              resolve(true);
            }, 100);
          })),
          run: jest.fn().mockReturnValue(Promise.resolve()),
        }
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      expect((await fetch("http://localhost:1612")).ok).toEqual(true);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(0);
      expect(endpointHandlers[1].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[1].run).toHaveBeenCalledTimes(1);
    });

    it('should test multiple endpointHandlers and return a 404 if none test', async () => {
      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>(resolve => {
            setTimeout(() => {
              resolve(false);
            }, 100);
          })),
          run: jest.fn().mockReturnValue(Promise.resolve()),
        },
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>(resolve => {
            setTimeout(() => {
              resolve(false);
            }, 100);
          })),
          run: jest.fn().mockReturnValue(Promise.resolve()),
        }
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      let response = await fetch("http://localhost:1612");

      expect(response.ok).toEqual(false);
      expect(response.status).toEqual(404);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(0);
      expect(endpointHandlers[1].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[1].run).toHaveBeenCalledTimes(0);
    });

    it('should return a 500 if the endpointHandler fails', async () => {
      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(Promise.resolve(true)),
          run: jest.fn().mockImplementation(async() => {
            throw new Error("Error in run.")
          }),
        }
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      let response = await fetch("http://localhost:1612");

      expect(response.ok).toEqual(false);
      expect(response.status).toEqual(500);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(1);
    });

    it('should return 404 work with no endpointHandlers', async () => {
      endpointHandlers = <any> [];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      let response = await fetch("http://localhost:1612");

      expect(response.ok).toEqual(false);
      expect(response.status).toEqual(404);
    });
  });

  describe('with basic endpointHandlers', () => {
    beforeEach(() => {
      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(Promise.resolve(true)),
          run: jest.fn().mockReturnValue(Promise.resolve()),
        }
      ];
    });

    it('should pass error of service initialization if it fails', async () => {
      let error = new Error("Error in initialization.");
      let serviceRegistryThis = {
        initializeServices: jest.fn().mockImplementation(async() => {
          throw error
        }),
        descriptions: <any> jest.fn().mockReturnValue([
          "testDescription"
        ]),
        run: jest.fn(
          (operation: IOperation) => {
            return Promise.resolve(undefined)
          }
        )
      };

      endpoint = new Endpoint(serviceRegistryThis, endpointHandlers);

      await expect(endpoint.start()).rejects.toEqual(error);
      expect(serviceRegistryThis.initializeServices).toHaveBeenCalledTimes(1);
    });
  });

  describe("with basic both", () => {
    beforeEach(async () => {
      serviceRegistry = {
        initializeServices: jest.fn().mockReturnValue(Promise.resolve()),
        descriptions: <any>jest.fn().mockReturnValue([
          "testDescription"
        ]),
        run: jest.fn(
          (operation: IOperation) => {
            return Promise.resolve(undefined)
          }
        )
      };

      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(Promise.resolve(true)),
          run: jest.fn().mockReturnValue(Promise.resolve()),
        }
      ]

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();
    });

    it('should start a server on port 1612', async () => {
      expect((await fetch("http://localhost:1612")).ok).toEqual(true);
    });

    it('should instantiate the serviceRegistries', () => {
      expect(serviceRegistry.initializeServices).toHaveBeenCalled();
    });

    it('should test the endpointHandlers and run them', async () => {
      expect((await fetch("http://localhost:1612")).ok).toEqual(true);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(1);
    });
  });
});
