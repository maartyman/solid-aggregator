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
exports.ActorRuleResolveHypermedia = void 0;
const bus_rule_resolve_1 = require("@comunica/bus-rule-resolve");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const LRUCache = require("lru-cache");
const MediatedRuleSource_1 = require("./MediatedRuleSource");
/**
 * A comunica Hypermedia Rule Resolve Actor.
 */
class ActorRuleResolveHypermedia extends bus_rule_resolve_1.ActorRuleResolveSource {
    constructor(args) {
        super(args);
        const cache = this.cache = this.cacheSize ?
            new LRUCache({ max: this.cacheSize }) :
            undefined;
        if (cache) {
            this.httpInvalidator.addInvalidateListener(({ url }) => url ? cache.delete(url) : cache.clear());
        }
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Add something like this back in when we have multiple sources
            // const sources = hasContextSingleSource(action.context);
            // if (!sources) {
            //   throw new Error(`Actor ${this.name} can only resolve quad pattern queries against a single source.`);
            // }
            return true;
        });
    }
    getSource(context) {
        var _a, _b;
        const url = context.get(reasoning_context_entries_1.KeysRdfReason.rules);
        if (!url) {
            throw new Error('No rule found in context');
        }
        let source = (_a = this.cache) === null || _a === void 0 ? void 0 : _a.get(url);
        if (!source) {
            // If not in cache, create a new source
            source = new MediatedRuleSource_1.MediatedRuleSource(context, url, this);
            // Set in cache
            (_b = this.cache) === null || _b === void 0 ? void 0 : _b.set(url, source);
        }
        return source;
    }
}
exports.ActorRuleResolveHypermedia = ActorRuleResolveHypermedia;
