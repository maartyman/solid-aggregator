import {Guard} from "./guard";
import {Aggregator} from "../aggregator/aggregator";
import {Logger} from "tslog";
import {loggerSettings} from "../utils/loggerSettings";
import * as http from "http";
import {GuardingConfig} from "../utils/guardingConfig";

export class GuardPolling implements Guard {
  private readonly logger = new Logger(loggerSettings);
  private notifiers = new Map<string, PolResource>();

  constructor() {
  }

  evaluateResource(resource: string, aggregator: Aggregator): void {
    //make sure resource isn't already polled before its added
    const polResource = this.notifiers.get(resource)
    if (polResource) {
      polResource.addAggregator(aggregator);
    }
    else {
      this.notifiers.set(resource, new PolResource(resource, aggregator));
    }
  }
}

class PolResource {
  private readonly logger = new Logger(loggerSettings);
  private readonly resource: string;
  private ETag?: string;
  private lastModified?: number;
  private aggregators: Aggregator[];

  constructor(resource: string, aggregator: Aggregator) {
    this.resource = resource;
    this.aggregators = [aggregator];

    this.getHead((res: http.IncomingMessage) => {
      const lastModifiedServer = res.headers["last-modified"];
      const ETagServer = res.headers.etag;
      if (ETagServer) {
        this.ETag = ETagServer;
      }
      else if (lastModifiedServer) {
        this.lastModified = new Date(lastModifiedServer).valueOf();
      }
      else {
        this.logger.error("Can't guard resource: '" + this.resource + "'. Server doesn't support Web Sockets nor does it support 'last-modified' or 'eTag' headers.");
      }
    });

    this.polHeadResource();
  }

  private polHeadResource() {
    this.getHead((res: http.IncomingMessage) => {
      if (this.ETag) {
        if (res.headers.etag !== this.ETag) {
          this.ETag = res.headers.etag;
          this.dataChanged();
        }
      }
      else if (this.lastModified) {
        const lastModifiedServer = res.headers["last-modified"];
        if (lastModifiedServer) {
          const lastModifiedDateServer = new Date(lastModifiedServer).valueOf();
          if (lastModifiedDateServer != this.lastModified) {
            this.lastModified = lastModifiedDateServer;
            this.dataChanged();
          }
        }
        else {
          this.logger.error("Last modified tag isn't set by the server for resource: '" + this.resource + "'");
        }
      }
    });
    setTimeout(this.polHeadResource.bind(this), GuardingConfig.pollingInterval);
  }

  private getHead(callback: (res: http.IncomingMessage) => void) {
    const req = http.request(this.resource, {
      method: "HEAD"
    }, callback);
    req.end();
  }

  public addAggregator(aggregator: Aggregator) {
    if (!this.aggregators.includes(aggregator)) {
      this.aggregators.push(aggregator);
    }
  }

  private dataChanged() {
    for (const aggregator of this.aggregators) {
      this.logger.debug("data has changed in resource: " + this.resource);
      aggregator.dataChanged(this.resource);
    }
  }
}
