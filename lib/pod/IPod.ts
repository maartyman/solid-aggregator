import type { ServiceDescription } from '../service/IService';

export interface IPod {
  newServiceLocation: (description: ServiceDescription) => Promise<string>;
}

export type PodServiceLocation = string;
