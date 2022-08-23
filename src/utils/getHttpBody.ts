import {IncomingMessage} from "http";
import {Logger, LogType} from "./logger";

export async function getHttpBody(req: IncomingMessage) : Promise<String> {
  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  });
  await ended(req);
  return body;
}

async function ended(req: IncomingMessage) : Promise<void> {
  req.on("end", () => {
    return;
  });
}
