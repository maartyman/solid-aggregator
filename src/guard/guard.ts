
//add resource: if resource already exists add queryExecutor to the notifying list
//otherwise add resource to guard

import {QueryExecutor} from "../queryExecutor/queryExecutor";
import {Resource} from "../resource/resource";
import {GuardFactory} from "./guardFactory";

export class Guard extends Actor<string, Resource, any> {
  static factory = new GuardFactory();

  evaluateResource(resource: string, aggregator: QueryExecutor): void {

  }
}
