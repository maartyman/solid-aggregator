"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@comunica/core");
const lib_1 = require("../lib");
describe('ActorRuleParseFixedMediaTypes', () => {
    const bus = new core_1.Bus({ name: 'bus' });
    describe('The ActorRuleParseFixedMediaTypes module', () => {
        it('should be a function', () => {
            expect(lib_1.ActorRuleParseFixedMediaTypes).toBeInstanceOf(Function);
        });
        it('should be a ActorRuleParseFixedMediaTypes constructor', () => {
            expect(new lib_1.ActorRuleParseFixedMediaTypes({ bus: new core_1.Bus({ name: 'bus' }),
                mediaTypes: {},
                name: 'actor' })).toBeInstanceOf(lib_1.ActorRuleParseFixedMediaTypes);
        });
        it('should not be able to create new ActorRuleParseFixedMediaTypes objects without \'new\'', () => {
            expect(() => { lib_1.ActorRuleParseFixedMediaTypes(); }).toThrow();
        });
    });
    describe('An ActorRuleParseFixedMediaTypes instance', () => {
        const actor = new lib_1.ActorRuleParseFixedMediaTypes({ bus,
            mediaTypes: { a: 0.5 },
            name: 'actor',
            priorityScale: 0.5 });
        it('should always resolve testHandleChecked', () => {
            return expect(actor.testHandleChecked()).resolves.toBeTruthy();
        });
    });
});
