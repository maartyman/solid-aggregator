import {IncomingMessage} from "http";
import {Logger, LogType} from "./logger";
import {QueryExplanation} from "../aggregator/queryExplanation";

export async function getHttpBody(req: IncomingMessage) : Promise<QueryExplanation> {
  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  });
  await ended(req);

  const json = JSON.parse(body);

  let queryExplaination = new QueryExplanation(
    json.queryString,
    json.sources,
    json.comunicaVersion,
    json.context,
    json.reasoningRules,
    json.lenient
  );

  return queryExplaination
}

async function ended(req: IncomingMessage) : Promise<void> {
  req.on("end", () => {
    return;
  });
}
