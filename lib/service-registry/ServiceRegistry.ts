import type { Operation, OperationResult } from '../service/Service';

export interface ServiceRegistry {
  get descriptions(): string[];
  initializeServices: () => Promise<void>;
  run: (operation: Operation) => Promise<OperationResult | undefined>;
}
