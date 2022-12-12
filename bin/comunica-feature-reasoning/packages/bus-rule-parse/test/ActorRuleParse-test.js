"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@comunica/core");
const lib_1 = require("../lib");
describe('ActorRuleParse', () => {
    describe('The ActorRuleParse module', () => {
        it('should be a function', () => {
            expect(lib_1.ActorRuleParse).toBeInstanceOf(Function);
        });
        it('should be a ActorRuleParse constructor', () => {
            expect(new lib_1.ActorRuleParse({ bus: new core_1.Bus({ name: 'bus' }), name: 'actor' }))
                .toBeInstanceOf(lib_1.ActorRuleParse);
        });
        it('should not be able to create new ActorRuleParse objects without \'new\'', () => {
            expect(() => { lib_1.ActorRuleParse(); }).toThrow();
        });
    });
});
