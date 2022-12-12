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
exports.ActorRuleResolveSource = void 0;
const ActorRuleResolve_1 = require("./ActorRuleResolve");
/**
 * A base implementation for rdf-resolve-quad-pattern events
 * that wraps around an {@link IRuleSource}.
 *
 * @see IRuleSource
 */
class ActorRuleResolveSource extends ActorRuleResolve_1.ActorRuleResolve {
    constructor(args) {
        super(args);
    }
    run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return { data: this.getSource(action.context).get() };
        });
    }
}
exports.ActorRuleResolveSource = ActorRuleResolveSource;
