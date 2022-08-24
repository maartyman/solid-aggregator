import {IncomingMessage} from "http";
import {Logger, LogType} from "./logger";
import {QueryExplanation} from "../aggregator/queryExplanation";

export async function getHttpBody(req: IncomingMessage) : Promise<QueryExplanation> {
  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  });
  await ended(req);
  return JSON.parse(body);
}

async function ended(req: IncomingMessage) : Promise<void> {
  req.on("end", () => {
    return;
  });
}
