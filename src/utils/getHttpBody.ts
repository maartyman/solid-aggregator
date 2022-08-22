import {IncomingMessage} from "http";
import {Logger, LogType} from "./logger";

export async function getHttpBody(req: IncomingMessage) : Promise<String> {
  let body = "";
  req.on('data', (chunk) => {
    Logger.getInstance().debug(`data: ${chunk}`, "getHttpBody");
    body += chunk;
  });
  Logger.getInstance().debug(req.readableEnded? "true" : "false", "getHttpBody");
  await ended(req);
  Logger.getInstance().debug(req.readableEnded? "true" : "false", "getHttpBody");
  Logger.getInstance().debug(`body: ${body}`, "getHttpBody");
  return body;
}

async function ended(req: IncomingMessage) : Promise<void> {
  req.on("end", () => {
    return;
  });
}
