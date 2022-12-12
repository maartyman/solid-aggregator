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
exports.ActorOptimizeRuleRemoveFalseConclusion = void 0;
const bus_optimize_rule_1 = require("@comunica/bus-optimize-rule");
/**
 * A comunica actor that optimizes rules by filtering out those with false conclusions
 */
class ActorOptimizeRuleRemoveFalseConclusion extends bus_optimize_rule_1.ActorOptimizeRule {
    constructor(args) {
        super(args);
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            // Console.log('test false conclusion', action.rules.length)
            return true;
        });
    }
    run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            const rules = action.rules.filter(rule => rule.conclusion !== false);
            return Object.assign(Object.assign({}, action), { rules });
        });
    }
}
exports.ActorOptimizeRuleRemoveFalseConclusion = ActorOptimizeRuleRemoveFalseConclusion;
