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
exports.substituteQuad = exports.evaluateNestedThroughRestriction = exports.evaluateRuleSet = exports.ActorRdfReasonRuleRestriction = void 0;
const bus_rdf_reason_1 = require("@comunica/bus-rdf-reason");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const asynciterator_1 = require("asynciterator");
const event_emitter_promisify_1 = require("event-emitter-promisify");
const n3_1 = require("n3");
const rdf_terms_1 = require("rdf-terms");
/**
 * A comunica actor that
 */
class ActorRdfReasonRuleRestriction extends bus_rdf_reason_1.ActorRdfReasonMediated {
    constructor(args) {
        super(args);
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!action.context.has(reasoning_context_entries_1.KeysRdfReason.data) || !action.context.has(reasoning_context_entries_1.KeysRdfReason.rules)) {
                throw new Error('Missing dataset or rule context');
            }
            return true;
        });
    }
    execute(action) {
        return __awaiter(this, void 0, void 0, function* () {
            const { context, rules } = action;
            const store = new n3_1.Store();
            let size = 0;
            do {
                size = store.size;
                // TODO: Handle rule assertions better
                const quadStreamInsert = evaluateRuleSet(rules, this.unionQuadSource(context).match);
                const { execute } = yield this.runImplicitUpdate({ quadStreamInsert: quadStreamInsert.clone(), context });
                yield Promise.all([execute(), yield (0, event_emitter_promisify_1.promisifyEventEmitter)(store.import(quadStreamInsert.clone()))]);
            } while (store.size > size);
        });
    }
}
exports.ActorRdfReasonRuleRestriction = ActorRdfReasonRuleRestriction;
function evaluateRuleSet(rules, match) {
    // Autostart needs to be false to prevent the iterator from ending before being consumed by rdf-update-quads
    // https://github.com/comunica/comunica-feature-reasoning/issues/904
    // https://github.com/RubenVerborgh/AsyncIterator/issues/25
    return new asynciterator_1.UnionIterator(rules.map((rule) => evaluateNestedThroughRestriction(rule, match)), { autoStart: false });
}
exports.evaluateRuleSet = evaluateRuleSet;
// We can probably use InitialBindings here to do a lot of optimizations
function evaluateNestedThroughRestriction(nestedRule, match) {
    const iterators = (0, asynciterator_1.single)(nestedRule).transform({
        autoStart: false,
        transform(rule, done, push) {
            let mappings = (0, asynciterator_1.single)({});
            while (rule) {
                mappings = rule.premise.reduce((iterator, premise) => new asynciterator_1.UnionIterator(iterator.map(mapping => {
                    const cause = substituteQuad(premise, mapping);
                    return match(cause).map(quad => {
                        let localMapping = {};
                        (0, rdf_terms_1.forEachTerms)(cause, (term, key) => {
                            if (term.termType === 'Variable' && localMapping) {
                                if (term.value in localMapping && !localMapping[term.value].equals(quad[key])) {
                                    localMapping = undefined;
                                }
                                else {
                                    localMapping[term.value] = quad[key];
                                }
                            }
                        });
                        return localMapping && Object.assign(localMapping, mapping);
                    }).filter((_mapping) => _mapping !== undefined);
                }), { autoStart: false }), mappings);
                push({
                    conclusion: rule.conclusion,
                    // The only time the mappings shouldn't be cloned is if the rules is
                    // not nested at all
                    mappings: nestedRule.next ? mappings.clone() : mappings,
                });
                // eslint-disable-next-line no-cond-assign
                if (rule = rule.next) {
                    mappings = mappings.clone();
                }
            }
            done();
        },
    }).map(({ mappings, conclusion }) => new asynciterator_1.UnionIterator(conclusion.map(quad => (conclusion.length > 1 ? mappings.clone() : mappings).map(mapping => substituteQuad(quad, mapping))), { autoStart: false }));
    return new asynciterator_1.UnionIterator(iterators, { autoStart: false });
}
exports.evaluateNestedThroughRestriction = evaluateNestedThroughRestriction;
function substituteQuad(term, mapping) {
    return (0, rdf_terms_1.mapTerms)(term, elem => elem.termType === 'Variable' && elem.value in mapping ? mapping[elem.value] : elem);
}
exports.substituteQuad = substituteQuad;
