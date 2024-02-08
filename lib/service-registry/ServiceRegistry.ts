import type { Operation, OperationResult } from '../service/IService';

export interface ServiceRegistry {
  get descriptions(): string[];
  initializeServices: () => Promise<void>;
  run: (operation: Operation) => Promise<OperationResult | undefined>;
}
