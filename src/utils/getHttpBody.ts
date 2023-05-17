import {IncomingMessage} from "http";
import {QueryExplanation} from "incremunica";

export async function getHttpBody(req: IncomingMessage) : Promise<{queryExplanation: QueryExplanation, Rules: string}> {
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

  return {queryExplanation: queryExplaination, Rules: json.rules}
}
