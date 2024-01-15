import {EndpointHandlerServiceDescription} from "../EndpointHandlerServiceDescription";
import {IServiceRegistry} from "../../service-registry/IServiceRegistry";
import {IOperation} from "../../service/IService";

describe("EndpointHandlerServiceDescription", () => {
  let endpointHandlerServiceDescription: EndpointHandlerServiceDescription;
  let serviceRegistry: IServiceRegistry;
  let endpointUrl: string;
  let descriptions: string[];

  describe("with basic setup", () => {
    beforeEach(() => {
      endpointUrl = '/endpoint/descriptions';
      descriptions = [
        "testDescription"
      ];

      serviceRegistry = {
        initializeServices: jest.fn().mockReturnValue(Promise.resolve()),
        descriptions: descriptions,
        run: jest.fn(
          (operation: IOperation) => {
            return Promise.resolve(undefined)
          }
        )
      };

      endpointHandlerServiceDescription = new EndpointHandlerServiceDescription(serviceRegistry, endpointUrl);
    });

    it('should test with right endpoint', async () => {
      expect(await endpointHandlerServiceDescription.test(<any>{
        url: endpointUrl
      })).toEqual(true);
    });

    it('should test with wrong endpoint', async () => {
      expect(await endpointHandlerServiceDescription.test(<any>{
        url: '/other'
      })).toEqual(false);
    });

    it('should test with variables', async () => {
      expect(await endpointHandlerServiceDescription.test(<any>{
        url: endpointUrl + '?var=5'
      })).toEqual(true);
    });

    it('should test with fragment', async () => {
      expect(await endpointHandlerServiceDescription.test(<any>{
        url: endpointUrl + '#frag'
      })).toEqual(true);
    });

    it('should test with undefined', async () => {
      await expect(endpointHandlerServiceDescription.test(<any>{
        url: undefined
      })).rejects.toEqual(TypeError("Cannot read properties of undefined (reading 'match')"));
    });

    it('should run', () => {
      let setHeaderFn = jest.fn();
      let writeFn = jest.fn();

      endpointHandlerServiceDescription.run(<any> {
        url: '/other'
      }, <any> {
        setHeader: setHeaderFn,
        write: writeFn
      });

      expect(setHeaderFn).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(writeFn).toHaveBeenCalledWith(JSON.stringify(descriptions));
    });
  });
});
