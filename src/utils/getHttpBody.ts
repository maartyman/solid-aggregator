import {IncomingMessage} from "http";
import {QueryExplanation} from "../queryExecutorPackage/queryExecutor/queryExplanation";

export async function getHttpBody(req: IncomingMessage) : Promise<QueryExplanation> {
  let body = "";
  req.on('data', (chunk) => {
    body += chunk;
  });

  await new Promise<void>((resolve, reject) => {
    req.on("end", () => {
      resolve();
    });
  });

  const json = JSON.parse(body);

  let queryExplaination = new QueryExplanation(
    json.queryString,
    json.sources,
    json.comunicaVersion,
    json.comunicaContext,
    json.reasoningRules,
    json.lenient
  );

  return queryExplaination
}
