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
exports.ActorRdfReasonMediated = void 0;
const asynciterator_1 = require("asynciterator");
const rdf_terms_1 = require("rdf-terms");
const ActorRdfReason_1 = require("./ActorRdfReason");
class ActorRdfReasonMediated extends ActorRdfReason_1.ActorRdfReason {
    constructor(args) {
        super(args);
    }
    runExplicitUpdate(changes) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mediatorRdfUpdateQuads.mediate(changes);
        });
    }
    runImplicitUpdate(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.runExplicitUpdate(Object.assign(Object.assign({}, action), { context: (0, ActorRdfReason_1.setImplicitDestination)(action.context) }));
        });
    }
    explicitQuadSource(context) {
        return {
            match: (pattern) => (0, asynciterator_1.wrap)(this.mediatorRdfResolveQuadPattern.mediate({ context, pattern }).then(({ data }) => data)),
        };
    }
    // TODO: See if we need to add this back in
    // protected implicitQuadSource(context: IActionContext): {
    //   match: (pattern: Algebra.Pattern) => AsyncIterator<RDF.Quad>
    // } {
    //   return this.explicitQuadSource(setImplicitSource(context));
    // }
    unionQuadSource(context) {
        return this.explicitQuadSource((0, ActorRdfReason_1.setUnionSource)(context));
    }
    // TODO [FUTURE]: Push this into a specific abstract interface for language agnostic reasoners.
    getRules(action) {
        const getRules = () => __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.mediatorRuleResolve.mediate(action);
            const { rules } = yield this.mediatorOptimizeRule.mediate(Object.assign({ rules: data }, action));
            return rules;
        });
        return (0, asynciterator_1.wrap)(getRules());
    }
    run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                execute: () => __awaiter(this, void 0, void 0, function* () {
                    const { updates, pattern } = action;
                    if (updates) {
                        // If there is an update - forget everything we know about the current status of reasoning
                        (0, ActorRdfReason_1.setReasoningStatus)(action.context, { type: 'full', reasoned: false });
                    }
                    const { status } = (0, ActorRdfReason_1.getSafeData)(action.context);
                    // If full reasoning is already being applied then just use the data from that
                    if (status.type === 'full' && status.reasoned) {
                        return status.done;
                    }
                    // TODO: Import from rdf-terms.js once https://github.com/rubensworks/rdf-terms.js/pull/42 is merged
                    /* istanbul ignore next  */
                    function matchBaseQuadPattern(__pattern, quad) {
                        const mapping = {};
                        function match(_pattern, _quad) {
                            return (0, rdf_terms_1.everyTerms)(_pattern, (term, key) => {
                                switch (term.termType) {
                                    case 'Quad':
                                        return _quad[key].termType === 'Quad' && match(term, _quad[key]);
                                    case 'Variable':
                                        // eslint-disable-next-line no-return-assign
                                        return term.value in mapping ?
                                            mapping[term.value].equals(_quad[key]) :
                                            (mapping[term.value] = _quad[key]) && true;
                                    default:
                                        return term.equals(_quad[key]);
                                }
                            });
                        }
                        return match(__pattern, quad);
                    }
                    // If we have already done partial reasoning and are only interested in a certain
                    // pattern then maybe we can use that
                    if (status.type === 'partial' && pattern) {
                        for (const [key, value] of status.patterns) {
                            if (value.reasoned && matchBaseQuadPattern(key, pattern)) {
                                return value.done;
                            }
                        }
                    }
                    this.logInfo(action.context, 'Starting reasoning ...');
                    const reasoningLock = this.execute(Object.assign(Object.assign({}, action), { rules: yield this.getRules(action).toArray() }));
                    if (pattern) {
                        // Set reasoning whole
                        const patterns = status.type === 'partial' ? status.patterns : new Map();
                        (0, ActorRdfReason_1.setReasoningStatus)(action.context, {
                            type: 'partial',
                            patterns: patterns.set(pattern, { type: 'full', reasoned: true, done: reasoningLock }),
                        });
                    }
                    else {
                        (0, ActorRdfReason_1.setReasoningStatus)(action.context, { type: 'full', reasoned: true, done: reasoningLock });
                    }
                    return reasoningLock;
                }),
            };
        });
    }
}
exports.ActorRdfReasonMediated = ActorRdfReasonMediated;
