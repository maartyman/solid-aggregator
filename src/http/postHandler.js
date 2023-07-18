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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostHandler = void 0;
const getHttpBody_1 = require("../utils/getHttpBody");
const loggerSettings_1 = require("../utils/loggerSettings");
const tslog_1 = require("tslog");
const incremunica_1 = require("incremunica");
const sh_1 = require("../utils/sh");
const fs = __importStar(require("fs"));
class PostHandler {
    static handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
            logger.debug(`POST request received`);
            let fileName = (new Date()).valueOf() + '.rml.ttl';
            let location = '/rules/' + fileName;
            //let location = '/home/maarten/Documents/doctoraat/code/solid-agent/rules/' + fileName;
            //let ruleFileNames = '"/rules/ggdm-identity.rml.ttl" "/rules/ggdm-privacy.rml.ttl"';
            let ruleFileNames = ""; //'"/rules/ggdm-identity.rml.ttl" "/rules/ggdm-privacy.rml.ttl" "/rules/fhir-to-ggdm.rml.ttl"';
            let fileCreated = false;
            try {
                let body = yield (0, getHttpBody_1.getHttpBody)(req);
                logger.debug(JSON.stringify(body));
                let query = body.queryExplanation.queryString;
                //let location = '/rules/' + fileName;
                if (body.rules && body.rules !== "") {
                    logger.debug("saving rules", body.rules);
                    yield new Promise((resolve, reject) => fs.writeFile(location, body.rules, err => {
                        if (err) {
                            logger.debug("error saving rules");
                            fs.unlinkSync(location);
                            reject(err);
                        }
                        fileCreated = true;
                        ruleFileNames += ' "' + location + '"';
                        resolve();
                    }));
                    const exec = "java -Djava.library.path=/usr/lib/swi-prolog/lib/x86_64-linux/ -jar /SRR/target/SRR-1.1-SNAPSHOT-jar-with-dependencies.jar";
                    //const exec = "docker run srr";
                    //let { stdout } = await sh(exec + " " + body.queryExplanation.queryString + " ./rules/rules.rml.ttl");
                    //let { stdout } = await sh(exec + " '" + body.queryExplanation.queryString.replace(/(\r\n|\n|\r)/gm, "") + "'");
                    logger.debug("exec: " + exec + " '" + body.queryExplanation.queryString + "' " + ruleFileNames);
                    let { stdout } = yield (0, sh_1.sh)(exec + " '" + body.queryExplanation.queryString + "' " + ruleFileNames);
                    logger.debug("output: " + stdout);
                    if (stdout !== "") {
                        query = stdout.replace(new RegExp("bnode(".replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), "BNODE(");
                        logger.debug(`Query changed from:\n${body.queryExplanation.queryString}\nto:\n${query}`);
                    }
                }
                let queryExplanation = new incremunica_1.QueryExplanation(query, body.queryExplanation.sources, "default", "default", "", true);
                logger.debug(`query: \n${JSON.stringify(queryExplanation)}`);
                let queryExecutor = yield incremunica_1.QueryExecutor.factory.getOrCreate(incremunica_1.QueryExecutor.factory.queryExplanationToUUID(queryExplanation), incremunica_1.QueryExecutor, queryExplanation, false);
                queryExecutor.delete();
                logger.debug(`Writing 200: Ok`);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.write(JSON.stringify({ bindings: yield queryExecutor.getData(), query: query }));
                res.end();
                queryExecutor.delete();
            }
            catch (e) {
                logger.debug(`Writing 500: ` + e);
                res.statusCode = 500;
                res.write(JSON.stringify({ error: e }));
                res.end();
            }
            if (fileCreated) {
                fs.unlinkSync(location);
            }
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
