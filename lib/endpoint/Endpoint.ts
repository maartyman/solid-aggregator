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
    this.serviceRegistry.initializeServices().then((): void => {
      this.httpServer.listen(8080);
      this.httpServer.on('request', (request: IncomingMessage, response: ServerResponse): void => {
        Promise.race(
          this.endpointHandlers.map(
            async(endpointHandler): Promise<IEndpointHandler | undefined> =>
              await endpointHandler.test(request) ? endpointHandler : undefined,
          ),
        )
          .then((endpointHandler): void => {
            if (endpointHandler === undefined) {
              response.statusCode = 404;
              response.end();
              return;
            }
            endpointHandler.run(request, response)
              .then((): void => {
                response.end();
              })
              .catch((): void => {
                response.statusCode = 500;
                response.end();
              });
          })
          .catch((): void => {
            response.statusCode = 500;
            response.end();
          });
      });
    }).catch((error: Error): void => {
      throw error;
    });
  }
}

export interface IEndpointHandler {
  test: (request: IncomingMessage) => Promise<boolean>;
  run: (request: IncomingMessage, response: ServerResponse) => Promise<void>;
}
