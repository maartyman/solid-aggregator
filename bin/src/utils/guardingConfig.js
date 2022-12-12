"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardingConfig = void 0;
class GuardingConfig {
    constructor(guardingType, args) {
        this.guardingType = guardingType;
        this.args = args;
    }
}
exports.GuardingConfig = GuardingConfig;
GuardingConfig.default = new GuardingConfig("none", []);
