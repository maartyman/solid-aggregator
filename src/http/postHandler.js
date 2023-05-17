"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostHandler = void 0;
const getHttpBody_1 = require("../utils/getHttpBody");
const loggerSettings_1 = require("../utils/loggerSettings");
const tslog_1 = require("tslog");
const incremunica_1 = require("incremunica");
const sh_1 = require("../utils/sh");
const fs = __importStar(require("fs"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
class PostHandler {
    static handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
            logger.debug(`POST request received`);
            let body = yield (0, getHttpBody_1.getHttpBody)(req);
            logger.debug(JSON.stringify(body), "rules:", body.rules);
            if (body.rules !== undefined && body.rules !== "") {
                let rules = yield (yield (0, cross_fetch_1.default)(body.rules)).text();
                let location = '/rules/' + (new Date()).valueOf() + '.rml.ttl';
                yield new Promise((resolve, reject) => fs.writeFile(location, rules, err => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                }));
                const exec = "java -Djava.library.path=/usr/lib/swi-prolog/lib/x86_64-linux/ -jar /SRR/target/SRR-1.0-SNAPSHOT-jar-with-dependencies.jar";
                //let { stdout } = await sh(exec + " " + body.queryExplanation.queryString + " ./rules/rules.rml.ttl");
                //let { stdout } = await sh(exec + " '" + body.queryExplanation.queryString.replace(/(\r\n|\n|\r)/gm, "") + "'");
                let { stdout } = yield (0, sh_1.sh)(exec + " '" + body.queryExplanation.queryString + "' " + location);
                if (stdout != "") {
                    logger.debug(`Query changed from:\n${body.queryExplanation.queryString}\nto:\n${stdout}`);
                    body.queryExplanation.queryString = stdout;
                }
            }
            logger.debug(`query: \n${JSON.stringify(body.queryExplanation)}`);
            let queryExecutor = yield incremunica_1.QueryExecutor.factory.getOrCreate(incremunica_1.QueryExecutor.factory.queryExplanationToUUID(body.queryExplanation), incremunica_1.QueryExecutor, body.queryExplanation, true);
            //TODO return HTTP 500 code on failure
            logger.debug(`Writing 200: Ok`);
            res.statusCode = 200;
            res.setHeader("Location", queryExecutor.key.toString());
            res.write(JSON.stringify(yield queryExecutor.getData()));
            res.end();
            /*
            else {
              queryExecutor.on("queryEngineEvent", (value) => {
                if (value == "build") {
                  logger.debug(`Writing 201: Created`);
                  res.statusCode = 201;
                  res.setHeader("Location", queryExecutor.key.toString());
                  res.write(JSON.stringify({bindings: queryExecutor.getData()}));
                  res.end();
                }
              });
            }
             */
        });
    }
}
exports.PostHandler = PostHandler;
class MutableQueryExplanation {
    constructor(queryExplanation) {
        this.comunicaContext = queryExplanation.comunicaContext;
        this.comunicaVersion = queryExplanation.comunicaVersion;
        this.lenient = queryExplanation.lenient;
        this.queryString = queryExplanation.queryString;
        this.reasoningRules = queryExplanation.reasoningRules;
        this.sources = queryExplanation.sources;
    }
}
