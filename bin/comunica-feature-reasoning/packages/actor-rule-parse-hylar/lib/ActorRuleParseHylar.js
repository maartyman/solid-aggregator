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
exports.parseTriple = exports.parseTriples = exports.parseRule = exports.ActorRuleParseHylar = void 0;
const bus_rule_parse_1 = require("@comunica/bus-rule-parse");
const asynciterator_1 = require("asynciterator");
const is_quad_1 = require("is-quad");
const n3_1 = require("n3");
const rdf_string_1 = require("rdf-string");
const { quad, variable } = n3_1.DataFactory;
/**
 * A comunica Hylar Rule Parse Actor.
 */
class ActorRuleParseHylar extends bus_rule_parse_1.ActorRuleParseFixedMediaTypes {
    /**
     * TODO: Check this
     * @param args -
     *   \ @defaultNested {{
     *       "application/hylar": 1.0,
     *       "text/hylar": 0.9
     *     }} mediaTypePriorities
     *   \ @defaultNested {{
     *       "text/hylar": "http://www.w3.org/ns/formats/Hylar",
     *       "application/hylar": "http://www.w3.org/ns/formats/Hylar"
     *     }} mediaTypeFormats
     */
    constructor(args) {
        super(args);
    }
    runHandle(action, mediaType, context) {
        return __awaiter(this, void 0, void 0, function* () {
            let buffer = '';
            // TODO: Make this a module of its own right
            const ruleStrings = (0, asynciterator_1.wrap)(action.data).map(chunk => chunk.toString()).transform({
                transform(data, done, push) {
                    for (const char of data) {
                        if (char === '\n') {
                            if (buffer !== '') {
                                push(buffer);
                                buffer = '';
                            }
                        }
                        else {
                            buffer += char;
                        }
                    }
                    // TODO: Fix this - it assumes 'clean' chunks
                    // it is here to handle the case where there is
                    // no line break at EOF
                    if (buffer !== '') {
                        push(buffer);
                        buffer = '';
                    }
                    done();
                },
            });
            return { data: ruleStrings.map(ruleString => parseRule(ruleString)) };
        });
    }
}
exports.ActorRuleParseHylar = ActorRuleParseHylar;
const TRIPLE = /((?<=\()\S+?\s\S+?\s\S+?(?=\)))|false/gui;
function parseRule(strRule) {
    const [premise, conclusion] = strRule.split('->');
    const premiseQuads = premise.match(TRIPLE);
    const conclusionQuads = conclusion.match(TRIPLE);
    /* istanbul ignore next - remove with closure of https://github.com/comunica/comunica-feature-reasoning/issues/31 */
    if (premiseQuads === null || conclusionQuads === null) {
        throw new Error(`Invalid rule: ${strRule}`);
    }
    return {
        ruleType: 'rdfs',
        premise: parseTriples(premiseQuads),
        conclusion: conclusionQuads[0] === 'false' ? false : parseTriples(conclusionQuads),
    };
}
exports.parseRule = parseRule;
function parseTriples(triples) {
    return triples.map(triple => parseTriple(triple));
}
exports.parseTriples = parseTriples;
function parseTriple(triple) {
    const [subject, predicate, object] = triple.split(' ');
    return (0, is_quad_1.termAsQuad)(quad(myStringToTerm(subject), myStringToTerm(predicate), myStringToTerm(object), new n3_1.DefaultGraph()));
}
exports.parseTriple = parseTriple;
const prefixes = {
    owl: 'http://www.w3.org/2002/07/owl#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    hax: 'http://ucbl.github.io/HyLAR-Reasoner/axioms/',
};
function myStringToTerm(value) {
    const split = value.split(':');
    if (split.length >= 2) {
        const prefix = split[0];
        if (prefix in prefixes) {
            value = prefixes[prefix] + value.slice(prefix.length + 1);
        }
    }
    return (0, rdf_string_1.stringToTerm)(value);
}
