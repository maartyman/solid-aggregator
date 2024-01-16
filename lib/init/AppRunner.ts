import * as path from 'node:path';
import { ComponentsManager } from 'componentsjs';
import type { Endpoint } from '../endpoint/Endpoint';

export class AppRunner {
  public async run(): Promise<void> {
    const manager = await ComponentsManager.build({
      mainModulePath: path.join(__dirname, '../..'),
    });
    await manager.configRegistry.register('../../config/default.json');

    const endpoint: Endpoint = await manager.instantiate('urn:solid-aggregator:endpoint');
    await endpoint.start();
  }
}
