import type { IncomingMessage, ServerResponse } from 'node:http';
import type { IEndpointHandler } from '../Endpoint';
import { Endpoint } from '../Endpoint';
import type { IServiceRegistry } from '../../service-registry/IServiceRegistry';

describe('Endpoint', (): void => {
  let serviceRegistry: IServiceRegistry;
  let endpointHandlers: IEndpointHandler[];
  let endpoint: Endpoint;

  afterEach(async(): Promise<void> => {
    await new Promise<void>((resolve): void => (endpoint as any).httpServer.close((): void => {
      resolve();
    }));
  });

  describe('with basic serviceRegistry', (): void => {
    beforeEach((): void => {
      serviceRegistry = {
        initializeServices: jest.fn().mockResolvedValue(undefined),
        descriptions: jest.fn().mockReturnValue([
          'testDescription',
        ]) as any,
        run: jest.fn(
          async(): Promise<undefined> => undefined,
        ),
      };
    });

    it('should test multiple endpointHandlers and run the fastest.', async(): Promise<void> => {
      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>((resolve): void => {
            setTimeout((): void => {
              resolve(true);
            }, 500);
          })),
          run: jest.fn().mockResolvedValue(undefined),
        },
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>((resolve): void => {
            setTimeout((): void => {
              resolve(true);
            }, 100);
          })),
          run: jest.fn().mockResolvedValue(undefined),
        },
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      expect((await fetch('http://localhost:1612')).ok).toBe(true);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(0);
      expect(endpointHandlers[1].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[1].run).toHaveBeenCalledTimes(1);
    });

    it('should test multiple endpointHandlers and not run the undefined.', async(): Promise<void> => {
      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>((resolve): void => {
            resolve(false);
          })),
          run: jest.fn().mockResolvedValue(undefined),
        },
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>((resolve): void => {
            setTimeout((): void => {
              resolve(true);
            }, 100);
          })),
          run: jest.fn().mockResolvedValue(undefined),
        },
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      expect((await fetch('http://localhost:1612')).ok).toBe(true);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(0);
      expect(endpointHandlers[1].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[1].run).toHaveBeenCalledTimes(1);
    });

    it('should test multiple endpointHandlers and return a 404 if none test.', async(): Promise<void> => {
      endpointHandlers = [
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>((resolve): void => {
            setTimeout((): void => {
              resolve(false);
            }, 100);
          })),
          run: jest.fn().mockResolvedValue(undefined),
        },
        {
          test: jest.fn().mockReturnValue(new Promise<boolean>((resolve): void => {
            setTimeout((): void => {
              resolve(false);
            }, 100);
          })),
          run: jest.fn().mockResolvedValue(undefined),
        },
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      const response = await fetch('http://localhost:1612');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(0);
      expect(endpointHandlers[1].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[1].run).toHaveBeenCalledTimes(0);
    });

    it('should return a 500 if the endpointHandler fails.', async(): Promise<void> => {
      endpointHandlers = [
        {
          test: jest.fn().mockResolvedValue(true),
          run: jest.fn().mockImplementation(async(): Promise<void> => {
            throw new Error('Error in run.');
          }),
        },
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      const response = await fetch('http://localhost:1612');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(1);
    });

    it('should return 404 work with no endpointHandlers.', async(): Promise<void> => {
      endpointHandlers = [] as any;

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();

      const response = await fetch('http://localhost:1612');

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('with basic endpointHandlers', (): void => {
    beforeEach((): void => {
      endpointHandlers = [
        {
          test: jest.fn().mockResolvedValue(true),
          run: jest.fn().mockResolvedValue(undefined),
        },
      ];
    });

    it('should pass error of service initialization if it fails.', async(): Promise<void> => {
      const error = new Error('Error in initialization.');
      const serviceRegistryThis = {
        initializeServices: jest.fn().mockImplementation(async(): Promise<void> => {
          throw error;
        }),
        descriptions: jest.fn().mockReturnValue([
          'testDescription',
        ]) as any,
        run: jest.fn(
          async(): Promise<undefined> => undefined,
        ),
      };

      endpoint = new Endpoint(serviceRegistryThis, endpointHandlers);

      await expect(endpoint.start()).rejects.toEqual(error);
      expect(serviceRegistryThis.initializeServices).toHaveBeenCalledTimes(1);
    });
  });

  describe('with basic both', (): void => {
    beforeEach(async(): Promise<void> => {
      serviceRegistry = {
        initializeServices: jest.fn().mockResolvedValue(undefined),
        descriptions: jest.fn().mockReturnValue([
          'testDescription',
        ]) as any,
        run: jest.fn(
          async(): Promise<undefined> => undefined,
        ),
      };

      endpointHandlers = [
        {
          test: jest.fn().mockResolvedValue(true),
          run: jest.fn().mockResolvedValue(undefined),
        },
      ];

      endpoint = new Endpoint(serviceRegistry, endpointHandlers);
      await endpoint.start();
    });

    it('should start a server on port 1612.', async(): Promise<void> => {
      expect((await fetch('http://localhost:1612')).ok).toBe(true);
    });

    it('should instantiate the serviceRegistries.', (): void => {
      expect(serviceRegistry.initializeServices).toHaveBeenCalledWith();
    });

    it('should test the endpointHandlers and run them.', async(): Promise<void> => {
      expect((await fetch('http://localhost:1612')).ok).toBe(true);
      expect(endpointHandlers[0].test).toHaveBeenCalledTimes(1);
      expect(endpointHandlers[0].run).toHaveBeenCalledTimes(1);
    });

    it('should error if the handle request function throws an error.', async(): Promise<void> => {
      (endpoint as any).handleRequest = async(request: IncomingMessage, response: ServerResponse): Promise<void> => {
        response.end();
        throw new Error('TestError');
      };

      const spyInstance = jest.spyOn(console, 'error').mockImplementation();

      expect((await fetch('http://localhost:1612')).ok).toBe(true);
      expect(spyInstance).toHaveBeenCalledWith(new Error('TestError'));
    });
  });
});
