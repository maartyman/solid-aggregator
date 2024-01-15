import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { createServer } from 'node:http';
import type { IServiceRegistry } from '../service-registry/IServiceRegistry';

export class Endpoint {
  public readonly serviceRegistry: IServiceRegistry;
  public readonly endpointHandlers: IEndpointHandler[];
  private readonly httpServer: Server;

  public constructor(serviceRegistry: IServiceRegistry, endpointHandlers: IEndpointHandler[]) {
    this.serviceRegistry = serviceRegistry;
    this.endpointHandlers = endpointHandlers;
    this.httpServer = createServer();
  }

  public async start(): Promise<void> {
    await this.serviceRegistry.initializeServices();

    this.httpServer.listen(1612);
    this.httpServer.on('request', async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
      let currentEndpointHandler = await Promise.any(
        this.endpointHandlers.map(
          async (endpointHandler): Promise<IEndpointHandler> => {
            if (await endpointHandler.test(request)) {
              return endpointHandler;
            }
            throw new Error("Test returned false.");
          }
        )
      ).catch(() => {
        response.statusCode = 404;
      });

      if (currentEndpointHandler) {
        await currentEndpointHandler.run(request, response)
          .catch(() => {
            response.statusCode = 500;
          });
      }

      response.end();
    });
  }
}

export interface IEndpointHandler {
  test: (request: IncomingMessage) => Promise<boolean>;
  run: (request: IncomingMessage, response: ServerResponse) => Promise<void>;
}
