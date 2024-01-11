import type { IOperation, IOperationResult } from '../service/IService';

export interface IServiceRegistry {
  get descriptions(): string[];
  initializeServices: () => Promise<void>;
  run: (operation: IOperation) => Promise<IOperationResult | undefined>;
}
