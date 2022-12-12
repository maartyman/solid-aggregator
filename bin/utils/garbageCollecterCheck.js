"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanup = void 0;
const tslog_1 = require("tslog");
exports.cleanup = new FinalizationRegistry((key) => {
    new tslog_1.Logger().debug("Following object has been garbage collected: " + key.toString());
});
