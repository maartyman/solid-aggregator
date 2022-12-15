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
exports.PostHandler = void 0;
const getHttpBody_1 = require("../utils/getHttpBody");
const loggerSettings_1 = require("../utils/loggerSettings");
const tslog_1 = require("tslog");
const incremunica_1 = require("incremunica");
class PostHandler {
    static handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
            logger.debug(`POST request received`);
            let queryExplanation = yield (0, getHttpBody_1.getHttpBody)(req);
            logger.debug(`query: \n${JSON.stringify(queryExplanation)}`);
            let queryExecutor = yield incremunica_1.QueryExecutor.factory.getOrCreate(incremunica_1.QueryExecutor.factory.queryExplanationToUUID(queryExplanation), incremunica_1.QueryExecutor, queryExplanation, true);
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
