import type { IFetch } from './IFetch';

export class NativeFetch implements IFetch {
  public async fetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
    return fetch(input, init);
  }
}
