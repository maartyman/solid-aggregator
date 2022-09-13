
//add resource: if resource already exists add aggregator to the notifying list
//otherwise add resource to guarding

import {Aggregator} from "../aggregator/aggregator";

export interface Guard {

  evaluateResource(resource: string, aggregator: Aggregator): void;


}
