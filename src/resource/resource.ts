import {Guard} from "../guard/guard";
import {QueryExecutor} from "../queryExecutor/queryExecutor";
import {ResourceFactory} from "./resourceFactory";

export class Resource extends Actor<string, QueryExecutor, Guard> {
  static factory = new ResourceFactory();

  public guardingActive = false;

  constructor(key: string) {
    super(key);
    Guard.factory.getOrCreate(this.key, this);
  }

  public resourceChanged() {
    for (const queryExecutor of this.getParents()) {
      queryExecutor.dataChanged(this);
    }
  }
}
