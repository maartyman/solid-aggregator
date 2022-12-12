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
exports.mediatorRuleResolve = exports.RULES = void 0;
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const asynciterator_1 = require("asynciterator");
const n3_1 = require("n3");
const { quad, variable, namedNode } = n3_1.DataFactory;
exports.RULES = {
    'multi-conclusion-rules': [
        {
            ruleType: 'premise-conclusion',
            premise: [
                quad(variable('?s'), variable('?p'), variable('?o'), variable('?g')),
            ],
            conclusion: [
                quad(variable('?s'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing1'), variable('?g')),
                quad(variable('?s'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing2'), variable('?g')),
            ],
        },
    ],
    'my-unnested-rules': [
        {
            ruleType: 'premise-conclusion',
            premise: [
                quad(variable('?s'), namedNode('http://example.org#a'), variable('?o'), variable('?g')),
                quad(variable('?o'), namedNode('http://example.org#subsetOf'), variable('?o2'), variable('?g')),
            ],
            conclusion: [
                quad(variable('?s'), namedNode('http://example.org#a'), variable('?o2'), variable('?g')),
            ],
        },
        {
            ruleType: 'premise-conclusion',
            premise: [
                quad(variable('?s'), namedNode('http://example.org#a'), variable('?o'), variable('?g')),
            ],
            conclusion: [
                quad(variable('?o'), namedNode('http://example.org#a'), namedNode('http://example.org#Class'), variable('?g')),
            ],
        },
    ],
    'my-nested-rules': [
        {
            ruleType: 'nested-premise-conclusion',
            premise: [
                quad(variable('?s'), namedNode('http://example.org#a'), variable('?o'), variable('?g')),
            ],
            conclusion: [
                quad(variable('?o'), namedNode('http://example.org#a'), namedNode('http://example.org#Class'), variable('?g')),
            ],
            next: {
                premise: [
                    quad(variable('?o'), namedNode('http://example.org#subsetOf'), variable('?o2'), variable('?g')),
                ],
                conclusion: [
                    quad(variable('?s'), namedNode('http://example.org#a'), variable('?o2'), variable('?g')),
                ],
            },
        },
    ],
    'my-repeated-var-rules': [
        {
            ruleType: 'premise-conclusion',
            premise: [
                quad(variable('?s'), namedNode('http://example.org#a'), variable('?s'), variable('?g')),
            ],
            conclusion: [
                quad(variable('?s'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing'), variable('?g')),
            ],
        },
    ],
};
exports.mediatorRuleResolve = {
    mediate(action) {
        return __awaiter(this, void 0, void 0, function* () {
            const ruleString = action.context.get(reasoning_context_entries_1.KeysRdfReason.rules);
            return {
                data: (0, asynciterator_1.fromArray)(exports.RULES[ruleString]),
            };
        });
    },
};
