"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHttpBody = void 0;
const incremunica_1 = require("incremunica");
function getHttpBody(req) {
    return __awaiter(this, void 0, void 0, function* () {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk;
        });
        yield new Promise((resolve, reject) => {
            req.on("end", () => {
                resolve();
            });
        });
        const json = JSON.parse(body);
        let queryExplaination = new incremunica_1.QueryExplanation(json.queryString, json.sources, json.comunicaVersion, json.comunicaContext, json.reasoningRules, json.lenient);
        return queryExplaination;
    });
}
exports.getHttpBody = getHttpBody;
