export interface IAsyncConstructor {
  subscribeInitialized: (callback: () => void) => void;
}

export abstract class AsyncConstructor implements IAsyncConstructor {
  public initialized = false;
  private readonly callbacks: (() => void)[] = [];

  protected constructor(args: AsyncConstructorArgs) {
    this.initialize(args)
      .then((): void => {
        this.initialized = true;
        for (const callback of this.callbacks) {
          callback();
        }
      })
      .catch((reason): void => {
        throw new Error(`Error during async initialization of class '${this.constructor.name}', reason: "${reason}".`);
      });
  }

  protected abstract initialize(args: AsyncConstructorArgs): Promise<void>;

  public subscribeInitialized(callback: () => void): void {
    this.callbacks.push(callback);
  }
}

export type AsyncConstructorArgs = any;
