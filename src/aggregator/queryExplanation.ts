import { IDataSource } from '@comunica/types';

export interface QueryExplanation {
  queryString: String;
  sources: [IDataSource];
  comunicaVersion?: ComunicaVersion;
  lenient?: boolean;
  context?: ComunicaContexts;
  reasoningRules?: String;
}

export enum ComunicaVersion {
  default = "comunica-sparql", //TODO not right
  reasoning = "comunica-reasoning", //TODO not right
  linkTraversal = "@comunica/query-sparql-link-traversal"
}

export enum ComunicaContexts {
  followAll = "node_modules/@comunica/config-query-sparql-link-traversal/config/config-follow-all.json",
}
