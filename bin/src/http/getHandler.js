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
exports.GetHandler = void 0;
const aggregatorKeeper_1 = require("../aggregator/aggregatorKeeper");
const generalUtils_1 = require("../utils/generalUtils");
const tslog_1 = require("tslog");
const loggerSettings_1 = require("../utils/loggerSettings");
class GetHandler {
    static handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
            logger.debug(`GET request received`);
            logger.debug(`url: \n${req.url}`);
            const queryUUID = (0, generalUtils_1.resolveUndefinedString)(req.url).split("/")[1];
            logger.debug(`query: \n${queryUUID}`);
            const aggregator = aggregatorKeeper_1.AggregatorKeeper.getInstance().getAggregator(queryUUID);
            if (aggregator.isQueryFinished()) {
                /* add 200 response header */
                logger.debug(`GET status code: 200`);
                res.statusCode = 200;
            }
            else {
                /* add 206 response header */
                logger.debug(`GET status code: 206`);
                res.statusCode = 206;
            }
            res.setHeader("Content-Type", "text/text");
            const returnValue = JSON.stringify({ bindings: aggregator.getData() });
            logger.debug(`result: \n${returnValue}`);
            res.write(returnValue);
            res.end();
        });
    }
}
exports.GetHandler = GetHandler;
