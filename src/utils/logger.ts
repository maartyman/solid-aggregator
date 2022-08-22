export enum LogType {
  silly = "silly",
  debug = "debug",
  verbose = "verbose",
  info = "info",
  warn = "warn",
  error = "error"
}

export class Logger {
  private logger;
  private static instance: Logger | null;

  constructor(loggerType: LogType) {
    // @ts-ignore
    this.logger = new (new require('lazy-logger'))(loggerType, true, './log/log-', 'yyyy-MM-dd');
  }

  static setInstance(loggerType: LogType) {
    if (this.instance == null) {
      this.instance = new Logger(loggerType);
    }
    return this.instance;
  }

  static getInstance() {
    if (this.instance == null) {
      this.instance = new Logger(LogType.debug);
      this.instance.warn("Logger was not instantiated, instantiated it with debug level", this);
    }
    return this.instance;
  }

  private getString(instance: Instance | String){
    if (typeof(instance) == "string") {
      return instance;
    }
    return instance.constructor.name;
  }

  public silly(message: String, instance: Instance | String) {
    this.logger.silly(`[ ${ this.getString(instance) } ] => ` + message);
  }

  public debug(message: String, instance: Instance | String) {
    this.logger.debug(`[ ${ this.getString(instance) } ] => ` + message);
  }

  public verbose(message: String, instance: Instance | String) {
    this.logger.verbose(`[ ${ this.getString(instance) } ] => ` + message);
  }

  public info(message: String, instance: Instance | String) {
    this.logger.info(`[ ${ this.getString(instance) } ] => ` + message);
  }

  public warn(message: String, instance: Instance | String) {
    this.logger.warn(`[ ${ this.getString(instance) } ] => ` + message);
  }

  public error(message: String, instance: Instance | String) {
    this.logger.error(`[ ${ this.getString(instance) } ] => ` + message);
  }
}

interface Constructor {
  name: string;
}

interface Instance {
  constructor: Constructor;
}
