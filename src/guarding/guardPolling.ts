import {Guard} from "./guard";
import {Aggregator} from "../aggregator/aggregator";

export class GuardPolling implements Guard {


  constructor(host: string) {
    //TODO implement polling
  }

  evaluateResource(resource: string, aggregator: Aggregator): void {
  }


}
