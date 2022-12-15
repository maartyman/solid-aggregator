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
const tslog_1 = require("tslog");
const loggerSettings_1 = require("../utils/loggerSettings");
const incremunica_1 = require("incremunica");
const setHeaders_1 = require("./setHeaders");
const resolveUndefined_1 = require("../utils/resolveUndefined");
class GetHandler {
    static handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
            logger.debug(`Head request received`);
            logger.debug(`url: \n${req.url}`);
            const queryUUID = (0, resolveUndefined_1.resolveUndefined)(req.url, "").split("/")[1];
            logger.debug(`query: \n${queryUUID}`);
            const queryExecutor = incremunica_1.QueryExecutor.factory.get(queryUUID);
            const hasNoError = (0, setHeaders_1.setHeaders)(logger, res, queryExecutor);
            if (hasNoError) {
                res.write("");
                res.end();
            }
        });
    }
}
exports.GetHandler = GetHandler;
