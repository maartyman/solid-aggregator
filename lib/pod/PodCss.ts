import * as path from 'node:path';
import * as fs from 'fs-extra';
import { AppRunner } from '@solid/community-server';
import { v4 } from 'uuid';
import { AsyncConstructor } from '../core/AsyncConstructor';
import type { IServiceDescription } from '../service/IService';
import type { IPod, PodServiceLocation } from './IPod';

export class PodCss extends AsyncConstructor implements IPod {
  public podURL = 'http://localhost:3000/aggregator';

  public constructor() {
    super({});
  }

  protected async initialize(): Promise<void> {
    // TODO [2024-03-01]: make sure the file for the server is selected => not sure actually

    const loaderProperties = {
      mainModulePath: 'node_modules/@solid/community-server/',
      dumpErrorState: true,
      typeChecking: false,
    };

    const config = path.join(__dirname, './assets/css-config.json');

    const shorthand: Record<string, unknown> = {
      rootFilePath: path.join(__dirname, './assets/podData/'),
    };
    if (!(await fs.pathExists(path.join(__dirname, './assets/podData/')))) {
      shorthand.seedConfig = path.join(__dirname, './assets/seed.json');
    }

    await (new AppRunner()).run({
      loaderProperties,
      config,
      shorthand,
    });
    // TODO [2024-03-01]: Edit profile card
  }

  public async newServiceLocation(description: IServiceDescription): Promise<PodServiceLocation> {
    if (!this.initialized) {
      await new Promise<void>((resolve): void => {
        this.subscribeInitialized((): void => {
          resolve();
        });
      });
    }

    // Create service folder with uuid
    const location = `${this.podURL}/${v4()}`;
    const response = await fetch(`${location}/description`, {
      method: 'PUT',
      body: description.toString(),
    });

    if (response.ok) {
      return location;
    }
    // TODO [2024-03-01]: redo maybe?
    throw new Error(`Can't create location on the Solid Server: ${response.statusText}`);
  }
}
