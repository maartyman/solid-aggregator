import {EventEmitter} from "events";


export class EventEmittingActor<
  KeyType,
  ParentType extends Actor<any, any, any>,
  ChildType extends Actor<any, any, any>
  >
  extends Actor<
    KeyType,
    ParentType,
    ChildType
    > {
  private readonly eventEmitter = new EventEmitter();

  addListener(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this.eventEmitter.addListener(eventName, listener);
  }

  emit(eventName: string | symbol, ...args: any[]): boolean {
    return this.eventEmitter.emit(eventName, ...args);
  }

  eventNames(): Array<string | symbol> {
    return this.eventEmitter.eventNames();
  }

  getMaxListeners(): number {
    return this.eventEmitter.getMaxListeners();
  }

  listenerCount(eventName: string | symbol): number {
    return this.eventEmitter.listenerCount(eventName);
  }

  listeners(eventName: string | symbol): Function[] {
    return this.eventEmitter.listeners(eventName);
  }

  off(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this.eventEmitter.off(eventName, listener);
  }

  on(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this.eventEmitter.on(eventName, listener);
  }

  once(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this.eventEmitter.once(eventName, listener);
  }

  prependListener(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this.eventEmitter.prependListener(eventName, listener);
  }

  prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this.eventEmitter.prependOnceListener(eventName, listener);
  }

  rawListeners(eventName: string | symbol): Function[] {
    return this.eventEmitter.rawListeners(eventName);
  }

  removeAllListeners(event?: string | symbol): EventEmitter {
    return this.eventEmitter.removeAllListeners(event);
  }

  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): EventEmitter {
    return this.eventEmitter.removeListener(eventName, listener);
  }

  setMaxListeners(n: number): EventEmitter {
    return this.eventEmitter.setMaxListeners(n);
  }
}
