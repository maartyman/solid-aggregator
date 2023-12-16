import type { Server } from 'node:http';
import { createServer } from 'node:http';

export class Endpoint {
  private readonly httpServer: Server;
  public constructor() {
    this.httpServer = createServer();
  }

  public run(): void {
    this.httpServer.listen(8080);
  }
}
