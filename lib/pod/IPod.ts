import type { IServiceDescription } from '../service/IService';

export interface IPod {
  newServiceLocation: (description: IServiceDescription) => Promise<string>;
}

export type PodServiceLocation = string;
