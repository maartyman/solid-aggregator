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
exports.matchPatternMappings = exports.ActorOptimizeRulePatternRestriction = void 0;
const bus_optimize_rule_1 = require("@comunica/bus-optimize-rule");
const asynciterator_1 = require("asynciterator");
const rdf_terms_1 = require("rdf-terms");
/**
 * A comunica actor that restricts rules to only those needed to produce data matching a particular pattern
 */
class ActorOptimizeRulePatternRestriction extends bus_optimize_rule_1.ActorOptimizeRule {
    constructor(args) {
        super(args);
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pattern } = action;
            if (!pattern) {
                throw new Error('A Pattern is required for ActorOptimizeRulePatternRestriction');
            }
            // This actor is not useful on the pattern ?s ?p ?o ?g
            const hash = {};
            function uniqueVariable(term) {
                if (term.termType === 'Variable') {
                    if (hash[term.value]) {
                        return false;
                    }
                    hash[term.value] = true;
                    return true;
                }
                return false;
            }
            if ((0, rdf_terms_1.everyTerms)(pattern, uniqueVariable)) {
                throw new Error('Cannot optimise a pattern with all distinct variables');
            }
            // TODO: ADD THIS BACK IN
            // if (action.rules.some(rule => rule.conclusion === false)) {
            //   throw new Error('Cannot restrict rules with a false conclusion');
            // }
            return true;
        });
    }
    run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: REMOVE THIS IN FUTURE
            const rules = action.rules.filter((rule) => rule.conclusion !== false);
            return Object.assign(Object.assign({}, action), { rules: (0, asynciterator_1.fromArray)(restrictNaive(yield rules.toArray(), [action.pattern])) });
        });
    }
}
exports.ActorOptimizeRulePatternRestriction = ActorOptimizeRulePatternRestriction;
/**
 * @param rules The full rule set to be reasoned over
 * @param patterns The patterns that we are to match against in the rule set
 */
function restrictNaive(rules, patterns) {
    let allPatterns = [...patterns];
    let unusedRules = [...rules];
    let unusedRulesNew = [];
    const allRules = [];
    let size = -1;
    while (unusedRules.length > 0 && size < allRules.length) {
        size = allRules.length;
        for (const rule of unusedRules) {
            // Test to see if there is any match
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            if (rule.conclusion.some(quad => allPatterns.some(pattern => matchPatternMappings(pattern, quad)))) {
                allRules.push(rule);
                allPatterns = allPatterns.concat(rule.premise);
            }
            else {
                unusedRulesNew.push(rule);
            }
        }
        unusedRules = unusedRulesNew;
        unusedRulesNew = [];
    }
    return allRules;
}
/**
 * Check if the base quad matches against all terms in the pattern.
 *
 * Each term in the quad must satisfy the following:
 * * The pattern term is a variable, and all other variables with the same value - map to the same terms in the quad
 * * Both the quad term and pattern term are quads - and they satisfy the same conditions
 * * The pattern and quad terms are equal and not variables or quads
 *
 * @param pattern A pattern - possibly containing variables
 * @param quad A quad - possibly containing variables
 */
function matchPatternMappings(pattern, quad) {
    const mapping = {};
    return (0, rdf_terms_1.everyTerms)(pattern, (term, key) => {
        if (quad[key].termType === 'Variable') {
            return true;
        }
        if (term.termType !== 'Variable') {
            return term.equals(quad[key]);
        }
        // eslint-disable-next-line no-return-assign
        return term.value in mapping ? mapping[term.value].equals(quad[key]) : (mapping[term.value] = quad[key]) && true;
    });
}
exports.matchPatternMappings = matchPatternMappings;
