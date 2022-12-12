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
exports.ActorRuleParseN3 = void 0;
const bus_rule_parse_1 = require("@comunica/bus-rule-parse");
const asynciterator_1 = require("asynciterator");
const event_emitter_promisify_1 = require("event-emitter-promisify");
const n3_1 = require("n3");
const { quad } = n3_1.DataFactory;
// Test suite
// https://github.com/w3c/N3/blob/16d1eec49048f87a97054540f4e1301e73a12130/tests/N3Tests/cwm_syntax/
// this-quantifiers-ref2.n3
/**
 * A comunica N3 Rule Parse Actor.
 */
class ActorRuleParseN3 extends bus_rule_parse_1.ActorRuleParseFixedMediaTypes {
    /**
     * TODO: Check this
     * @param args -
     *   \ @defaultNested {{
     *       "application/n-quads": 1.0,
     *       "application/trig": 0.95,
     *       "application/n-triples": 0.8,
     *       "text/turtle": 0.6,
     *       "text/n3": 0.35
     *     }} mediaTypePriorities
     *   \ @defaultNested {{
     *       "application/n-quads": "http://www.w3.org/ns/formats/N-Quads",
     *       "application/trig": "http://www.w3.org/ns/formats/TriG",
     *       "application/n-triples": "http://www.w3.org/ns/formats/N-Triples",
     *       "text/turtle": "http://www.w3.org/ns/formats/Turtle",
     *       "text/n3": "http://www.w3.org/ns/formats/N3"
     *     }} mediaTypeFormats
     */
    constructor(args) {
        super(args);
    }
    runHandle(action, mediaType, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const { handle } = yield this.mediatorRdfParse.mediate({
                handle: action,
                context,
                handleMediaType: mediaType,
            });
            const store = new n3_1.Store();
            yield (0, event_emitter_promisify_1.promisifyEventEmitter)(store.import(handle.data));
            const matches = (0, asynciterator_1.wrap)(store.match(null, n3_1.DataFactory.namedNode('http://www.w3.org/2000/10/swap/log#implies'), null));
            const rules = matches.transform({
                transform({ subject, object }, done, push) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (subject.termType === 'BlankNode' && object.termType === 'BlankNode') {
                            push({
                                premise: yield match(store, subject),
                                conclusion: yield match(store, object),
                                ruleType: 'premise-conclusion',
                            });
                        }
                        done();
                    });
                },
            });
            return { data: rules };
        });
    }
}
exports.ActorRuleParseN3 = ActorRuleParseN3;
function match(store, object) {
    // TODO: add graph as variable
    return (0, asynciterator_1.wrap)(store.match(null, null, null, object))
        .map(_quad => quad(_quad.subject, _quad.predicate, _quad.object, n3_1.DataFactory.variable('g')))
        .toArray();
}
