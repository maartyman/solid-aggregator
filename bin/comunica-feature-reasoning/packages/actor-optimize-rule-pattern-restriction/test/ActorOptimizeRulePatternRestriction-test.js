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
const core_1 = require("@comunica/core");
const asynciterator_1 = require("asynciterator");
const n3_1 = require("n3");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const ActorOptimizeRulePatternRestriction_1 = require("../lib/ActorOptimizeRulePatternRestriction");
const DF = n3_1.DataFactory;
const factory = new sparqlalgebrajs_1.Factory();
describe('ActorOptimizeRulePatternRestriction', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('An ActorOptimizeRulePatternRestriction instance', () => {
        let actor;
        beforeEach(() => {
            actor = new ActorOptimizeRulePatternRestriction_1.ActorOptimizeRulePatternRestriction({ name: 'actor', bus });
        });
        it('should throw an error if no pattern is present', () => {
            return expect(actor.test({ context: new core_1.ActionContext(), rules: (0, asynciterator_1.fromArray)([]) })).rejects.toThrowError();
        });
        it('should not throw an error if pattern is present and rules are valid', () => {
            return expect(actor.test({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([]),
                pattern: factory.createPattern(DF.variable('x'), DF.variable('x'), DF.variable('x')) })).resolves.toBeTruthy();
        });
        it('should not throw an error if all variables are distinct', () => {
            return expect(actor.test({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([]),
                pattern: factory.createPattern(DF.variable('s'), DF.variable('p'), DF.variable('o'), DF.variable('g')) })).rejects.toThrowError();
        });
        it('should be true if there is at least one namedNode in the pattern', () => {
            return expect(actor.test({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([]),
                pattern: factory.createPattern(DF.variable('s'), DF.namedNode('p'), DF.variable('o'), DF.variable('g')) })).resolves.toBeTruthy();
        });
        it('should run', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([
                    {
                        ruleType: 'premise-conclusion',
                        premise: [],
                        conclusion: [],
                    },
                ]) });
            expect(yield rules.toArray()).toEqual([]);
        }));
        it('should remove a single rule that does not match the pattern', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([
                    {
                        ruleType: 'premise-conclusion',
                        premise: [],
                        conclusion: [DF.quad(DF.namedNode('a'), DF.namedNode('b'), DF.namedNode('c'))],
                    },
                ]),
                pattern: factory.createPattern(DF.variable('x'), DF.variable('x'), DF.variable('x')) });
            expect(yield rules.toArray()).toEqual([]);
        }));
        it('should keep a single rule that does match the pattern', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([
                    {
                        ruleType: 'premise-conclusion',
                        premise: [],
                        conclusion: [DF.quad(DF.namedNode('a'), DF.namedNode('a'), DF.namedNode('a'))],
                    },
                ]),
                pattern: factory.createPattern(DF.variable('x'), DF.variable('x'), DF.variable('x')) });
            expect(yield rules.toArray()).toEqual([{
                    ruleType: 'premise-conclusion',
                    premise: [],
                    conclusion: [DF.quad(DF.namedNode('a'), DF.namedNode('a'), DF.namedNode('a'))],
                }]);
        }));
        it('should keep a single rule that does match the pattern (variables and namednodes)', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([
                    {
                        ruleType: 'premise-conclusion',
                        premise: [],
                        conclusion: [DF.quad(DF.variable('x'), DF.namedNode('a'), DF.variable('y'))],
                    },
                ]),
                pattern: factory.createPattern(DF.variable('x'), DF.variable('x'), DF.variable('x')) });
            expect(yield rules.toArray()).toEqual([{
                    ruleType: 'premise-conclusion',
                    premise: [],
                    conclusion: [DF.quad(DF.variable('x'), DF.namedNode('a'), DF.variable('y'))],
                }]);
        }));
        it('should keep a single rule that does match another premise', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([
                    {
                        ruleType: 'premise-conclusion',
                        premise: [DF.quad(DF.namedNode('s'), DF.namedNode('p'), DF.namedNode('o'))],
                        conclusion: [DF.quad(DF.variable('x'), DF.namedNode('a'), DF.variable('y'))],
                    },
                    {
                        ruleType: 'premise-conclusion',
                        premise: [DF.quad(DF.namedNode('f'), DF.namedNode('n'), DF.namedNode('t'))],
                        conclusion: [DF.quad(DF.namedNode('s'), DF.namedNode('p'), DF.namedNode('o'))],
                    },
                ]),
                pattern: factory.createPattern(DF.variable('x'), DF.variable('x'), DF.variable('x')) });
            expect(yield rules.toArray()).toHaveLength(2);
        }));
        it('should work with default graph rule', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([
                    {
                        ruleType: 'premise-conclusion',
                        premise: [DF.quad(DF.variable('s'), DF.namedNode('a'), DF.variable('o'), DF.defaultGraph()), DF.quad(DF.variable('o'), DF.namedNode('subClassOf'), DF.variable('o2'), DF.defaultGraph())],
                        conclusion: [DF.quad(DF.variable('s'), DF.namedNode('a'), DF.variable('o2'), DF.defaultGraph())],
                    },
                ]),
                pattern: factory.createPattern(DF.variable('s'), DF.variable('p'), DF.variable('o'), DF.variable('g')) });
            expect(yield rules.toArray()).toHaveLength(1);
        }));
        it('should work with default graph rule and using restricted pattern', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ context: new core_1.ActionContext(),
                rules: (0, asynciterator_1.fromArray)([
                    {
                        ruleType: 'premise-conclusion',
                        premise: [DF.quad(DF.variable('s'), DF.namedNode('a'), DF.variable('o'), DF.defaultGraph()), DF.quad(DF.variable('o'), DF.namedNode('subClassOf'), DF.variable('o2'), DF.defaultGraph())],
                        conclusion: [DF.quad(DF.variable('s'), DF.namedNode('a'), DF.variable('o2'), DF.defaultGraph())],
                    },
                ]),
                pattern: factory.createPattern(DF.namedNode('Jesse'), DF.namedNode('a'), DF.variable('o'), DF.variable('g')) });
            expect(yield rules.toArray()).toHaveLength(1);
        }));
    });
});
