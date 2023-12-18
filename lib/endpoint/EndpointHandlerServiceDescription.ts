import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ServiceRegistry } from '../service-registry/ServiceRegistry';
import type { EndpointHandler } from './Endpoint';

export class EndpointHandlerServiceDescription implements EndpointHandler {
  public readonly serviceRegistry: ServiceRegistry;
  public readonly endpointUrl: string;

  public constructor(serviceRegistry: ServiceRegistry, endpointUrl: string) {
    this.serviceRegistry = serviceRegistry;
    this.endpointUrl = endpointUrl;
  }

  public async test(request: IncomingMessage): Promise<boolean> {
    return request.url === this.endpointUrl;
  }

  public async run(request: IncomingMessage, response: ServerResponse): Promise<void> {
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(this.serviceRegistry.descriptions));
  }
}
