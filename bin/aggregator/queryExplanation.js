"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryExplanation = void 0;
const generalUtils_1 = require("../utils/generalUtils");
class QueryExplanation {
    constructor(queryString, sources, comunicaVersion, context, reasoningRules, lenient) {
        this.queryString = queryString;
        this.sources = sources;
        switch (comunicaVersion) {
            case "default":
                this.comunicaVersion = "@comunica/query-sparql";
                break;
            case "reasoning":
                this.comunicaVersion = "@comunica/comuncia-feature-reasoning";
                break;
            case "link-traversal":
                this.comunicaVersion = "@comunica/query-sparql-link-traversal";
                break;
            case "solid":
                this.comunicaVersion = "@comunica/query-sparql-solid";
                break;
            default:
                this.comunicaVersion = "@comunica/query-sparql";
                break;
        }
        switch (context) {
            case "default":
                this.comunicaContext = "node_modules/@comunica/query-sparql/config/config-default.json";
                break;
            case "reasoning-default":
                this.comunicaContext = "comunica-feature-reasoning/engines/query-sparql-reasoning/config/config-default.json";
                break;
            case "link-traversal-default":
                this.comunicaContext = "node_modules/@comunica/config-query-sparql-link-traversal/config/config-default.json";
                break;
            case "link-traversal-follow-all":
                this.comunicaContext = "node_modules/@comunica/config-query-sparql-link-traversal/config/config-follow-all.json";
                break;
            case "link-traversal-follow-content-policies-conditional":
                this.comunicaContext = "node_modules/@comunica/config-query-sparql-link-traversal/config/config-follow-content-policies-conditional.json";
                break;
            case "link-traversal-follow-content-policies-restrictive":
                this.comunicaContext = "node_modules/@comunica/config-query-sparql-link-traversal/config/config-follow-content-policies-restrictive.json";
                break;
            case "link-traversal-follow-match-pattern-bound":
                this.comunicaContext = "node_modules/@comunica/config-query-sparql-link-traversal/config/config-follow-match-pattern-bound.json";
                break;
            case "link-traversal-follow-match-query":
                this.comunicaContext = "node_modules/@comunica/config-query-sparql-link-traversal/config/config-follow-match-query.json";
                break;
            case "solid-default":
                this.comunicaContext = "node_modules/@comunica/config-query-sparql-solid/config/config-default.json";
                break;
            default:
                switch (comunicaVersion) {
                    //TODO add custom configs
                    case "default":
                        this.comunicaContext = "node_modules/@comunica/query-sparql/config/config-default.json";
                        break;
                    case "reasoning":
                        this.comunicaContext = "comunica-feature-reasoning/engines/query-sparql-reasoning/config/config-default.json";
                        break;
                    case "link-traversal":
                        this.comunicaContext = "node_modules/@comunica/config-query-sparql-link-traversal/config/config-default.json";
                        break;
                    case "solid":
                        this.comunicaContext = "node_modules/@comunica/config-query-sparql-solid/config/config-default.json";
                        break;
                    default:
                        this.comunicaContext = "node_modules/@comunica/query-sparql/config/config-default.json";
                        break;
                }
                break;
        }
        this.reasoningRules = (0, generalUtils_1.resolveUndefined)(reasoningRules, "");
        this.lenient = (0, generalUtils_1.resolveUndefined)(lenient, false);
    }
}
exports.QueryExplanation = QueryExplanation;
