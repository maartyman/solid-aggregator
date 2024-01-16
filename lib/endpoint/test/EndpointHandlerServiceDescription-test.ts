import { EndpointHandlerServiceDescription } from '../EndpointHandlerServiceDescription';
import type { IServiceRegistry } from '../../service-registry/IServiceRegistry';

describe('EndpointHandlerServiceDescription', (): void => {
  let endpointHandlerServiceDescription: EndpointHandlerServiceDescription;
  let serviceRegistry: IServiceRegistry;
  let endpointUrl: string;
  let descriptions: string[];

  it('should return true on test if url path is empty.', async(): Promise<void> => {
    endpointUrl = '';
    descriptions = [
      'testDescription',
    ];

    serviceRegistry = {
      initializeServices: jest.fn().mockResolvedValue(undefined),
      descriptions,
      run: jest.fn(
        async(): Promise<undefined> => undefined,
      ),
    };

    endpointHandlerServiceDescription = new EndpointHandlerServiceDescription(serviceRegistry, endpointUrl);

    await expect(endpointHandlerServiceDescription.test(({
      url: endpointUrl,
    } as any))).resolves.toBe(true);
  });

  describe('with basic setup', (): void => {
    beforeEach((): void => {
      endpointUrl = '/endpoint/descriptions';
      descriptions = [
        'testDescription',
      ];

      serviceRegistry = {
        initializeServices: jest.fn().mockResolvedValue(undefined),
        descriptions,
        run: jest.fn(
          async(): Promise<undefined> => undefined,
        ),
      };

      endpointHandlerServiceDescription = new EndpointHandlerServiceDescription(serviceRegistry, endpointUrl);
    });

    it('should test with right endpoint.', async(): Promise<void> => {
      await expect(endpointHandlerServiceDescription.test(({
        url: endpointUrl,
      } as any))).resolves.toBe(true);
    });

    it('should test with wrong endpoint.', async(): Promise<void> => {
      await expect(endpointHandlerServiceDescription.test(({
        url: '/other',
      } as any))).resolves.toBe(false);
    });

    it('should test with variables.', async(): Promise<void> => {
      await expect(endpointHandlerServiceDescription.test(({
        url: `${endpointUrl}?var=5`,
      } as any))).resolves.toBe(true);
    });

    it('should test with fragment.', async(): Promise<void> => {
      await expect(endpointHandlerServiceDescription.test(({
        url: `${endpointUrl}#frag`,
      } as any))).resolves.toBe(true);
    });

    it('should test with undefined.', async(): Promise<void> => {
      await expect(endpointHandlerServiceDescription.test(({
        url: undefined,
      } as any))).rejects.toEqual(new Error('Test failed because the url is undefined!'));
    });

    it('should run.', async(): Promise<void> => {
      const setHeaderFn = jest.fn();
      const writeFn = jest.fn();

      await endpointHandlerServiceDescription.run(({
        url: '/other',
      } as any), ({
        setHeader: setHeaderFn,
        write: writeFn,
      } as any));

      expect(setHeaderFn).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(writeFn).toHaveBeenCalledWith(JSON.stringify(descriptions));
    });
  });
});
