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
const reasoning_mocks_1 = require("@comunica/reasoning-mocks");
require("jest-rdf");
const lib_1 = require("../lib");
describe('MediatedRuleSource', () => {
    let context;
    beforeEach(() => {
        context = new core_1.ActionContext({});
    });
    describe('The MediatedRuleSource module', () => {
        it('should be a function', () => {
            expect(lib_1.MediatedRuleSource).toBeInstanceOf(Function);
        });
    });
    describe('A MediatedRuleSource instance', () => {
        let source;
        beforeEach(() => {
            source = new lib_1.MediatedRuleSource(context, 'my-unnested-rules', { mediatorDereferenceRule: reasoning_mocks_1.mediatorDereferenceRule });
        });
        describe('match', () => {
            it('should return a stream', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(yield source.get().toArray()).toHaveLength(2);
                // Again - this should use the cache
                expect(yield source.get().toArray()).toHaveLength(2);
            }));
        });
    });
});
