export interface IFetch {
  fetch: (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
}
