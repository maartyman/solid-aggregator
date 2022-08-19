"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./utils/logger");
let logger = logger_1.Logger.getInstance(logger_1.LogType.debug);
logger.error("error", "root");
