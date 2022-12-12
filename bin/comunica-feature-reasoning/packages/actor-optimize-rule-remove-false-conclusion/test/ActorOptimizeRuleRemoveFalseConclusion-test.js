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
const ActorOptimizeRuleRemoveFalseConclusion_1 = require("../lib/ActorOptimizeRuleRemoveFalseConclusion");
describe('ActorOptimizeRuleRemoveFalseConclusion', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('An ActorOptimizeRuleRemoveFalseConclusion instance', () => {
        let actor;
        beforeEach(() => {
            actor = new ActorOptimizeRuleRemoveFalseConclusion_1.ActorOptimizeRuleRemoveFalseConclusion({ name: 'actor', bus });
        });
        it('should test', () => {
            return expect(actor.test({ rules: (0, asynciterator_1.fromArray)([]), context: new core_1.ActionContext() })).resolves.toEqual(true);
        });
        it('should run on an empty ruleset', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ rules: (0, asynciterator_1.fromArray)([]), context: new core_1.ActionContext() });
            expect(yield rules.toArray()).toEqual([]);
        }));
        it('should run on an empty normal rules', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ rules: (0, asynciterator_1.fromArray)([{
                        ruleType: 'premise-conclusion',
                        premise: [],
                        conclusion: [],
                    }]),
                context: new core_1.ActionContext() });
            expect(yield rules.toArray()).toEqual([{
                    ruleType: 'premise-conclusion',
                    premise: [],
                    conclusion: [],
                }]);
        }));
        it('should run on rules with a false conclusion', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ rules: (0, asynciterator_1.fromArray)([{
                        ruleType: 'rdfs',
                        premise: [],
                        conclusion: false,
                    }]),
                context: new core_1.ActionContext() });
            expect(yield rules.toArray()).toEqual([]);
        }));
        it('should run on rules with a mix of rules', () => __awaiter(void 0, void 0, void 0, function* () {
            const { rules } = yield actor.run({ rules: (0, asynciterator_1.fromArray)([{
                        ruleType: 'premise-conclusion',
                        premise: [],
                        conclusion: [],
                    }, {
                        ruleType: 'rdfs',
                        premise: [],
                        conclusion: false,
                    }]),
                context: new core_1.ActionContext() });
            expect(yield rules.toArray()).toEqual([{
                    ruleType: 'premise-conclusion',
                    premise: [],
                    conclusion: [],
                }]);
        }));
    });
});
