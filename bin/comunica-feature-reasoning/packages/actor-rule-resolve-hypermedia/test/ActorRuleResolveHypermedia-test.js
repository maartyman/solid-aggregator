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
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const reasoning_mocks_1 = require("@comunica/reasoning-mocks");
require("jest-rdf");
const lib_1 = require("../lib");
const MediatedRuleSource_1 = require("../lib/MediatedRuleSource");
describe('ActorRuleResolveHypermedia', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('The ActorRuleResolveHypermedia module', () => {
        it('should be a function', () => {
            expect(lib_1.ActorRuleResolveHypermedia).toBeInstanceOf(Function);
        });
        it('should be a ActorRuleResolveHypermedia constructor', () => {
            expect(new lib_1.ActorRuleResolveHypermedia({
                bus,
                mediatorDereferenceRule: reasoning_mocks_1.mediatorDereferenceRule,
            })).toBeInstanceOf(lib_1.ActorRuleResolveHypermedia);
        });
        it('should be a ActorRuleResolveHypermedia constructor constructable with cache', () => {
            let listener = null;
            const httpInvalidator = {
                addInvalidateListener: (l) => listener = l,
            };
            expect(new lib_1.ActorRuleResolveHypermedia({
                bus: new core_1.Bus({ name: 'bus' }),
                cacheSize: 10,
                httpInvalidator,
                mediatorDereferenceRule: reasoning_mocks_1.mediatorDereferenceRule,
            })).toBeInstanceOf(lib_1.ActorRuleResolveHypermedia);
            expect(listener).toBeTruthy();
        });
        it('should not be able to create new ActorRuleResolveHypermedia objects without \'new\'', () => {
            expect(() => { lib_1.ActorRuleResolveHypermedia(); }).toThrow();
        });
    });
    describe('An ActorRuleResolveHypermedia instance', () => {
        let actor;
        let context;
        let pattern;
        let httpInvalidator;
        let listener;
        beforeEach(() => {
            httpInvalidator = {
                addInvalidateListener: (l) => listener = l,
            };
            actor = new lib_1.ActorRuleResolveHypermedia({
                bus: new core_1.Bus({ name: 'bus' }),
                cacheSize: 10,
                httpInvalidator,
                mediatorDereferenceRule: reasoning_mocks_1.mediatorDereferenceRule,
                name: 'actor',
            });
            context = new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' });
        });
        describe('test', () => {
            it('should test', () => {
                return expect(actor.test({ context }))
                    .resolves.toBeTruthy();
            });
            //   It('should test on raw source form', () => {
            //     return expect(actor.test({
            //       context: new ActionContext(
            //         { [KeysRdfReason.rules.name]: 'abc' },
            //       ) }))
            //       .resolves.toBeTruthy();
            //   });
            //   it('should not test without a context', () => {
            //     return expect(actor.test({ pattern: null, context: null })).rejects.toBeTruthy();
            //   });
            //   it('should not test without a file', () => {
            //     return expect(actor.test({ pattern: null, context: new ActionContext({}) })).rejects.toBeTruthy();
            //   });
            //   it('should not test on an invalid value', () => {
            //     return expect(actor.test({ pattern: null,
            //       context: new ActionContext(
            //         { [KeysRdfReason.rules.name]: { value: null }},
            //       ) }))
            //       .rejects.toBeTruthy();
            //   });
            //   it('should not test on no sources', () => {
            //     return expect(actor.test({ pattern: null,
            //       context: new ActionContext(
            //         { '@comunica/bus-rdf-resolve-quad-pattern:sources': []},
            //       ) }))
            //       .rejects.toBeTruthy();
            //   });
            //   it('should not test on multiple sources', () => {
            //     return expect(actor.test(
            //       { pattern: null,
            //         context: new ActionContext(
            //           { '@comunica/bus-rdf-resolve-quad-pattern:sources': [{ value: 'a' }, { value: 'b' }]},
            //         ) },
            //     ))
            //       .rejects.toBeTruthy();
            //   });
            // });
            describe('getSource', () => {
                it('should return a MediatedRuleSource', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect(yield actor.getSource(context)).toBeInstanceOf(MediatedRuleSource_1.MediatedRuleSource);
                }));
                it('should cache the source', () => __awaiter(void 0, void 0, void 0, function* () {
                    const source1 = yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern);
                    const source2 = yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern)).toBe(source1);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern)).toBe(source2);
                }));
                it('should cache the source and allow invalidation for a specific url', () => __awaiter(void 0, void 0, void 0, function* () {
                    const source1 = yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern);
                    const source2 = yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern)).toBe(source1);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern)).toBe(source2);
                    listener({ url: 'my-unnested-rules' });
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern)).not.toBe(source1);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern)).toBe(source2);
                }));
                it('should cache the source and allow invalidation for all urls', () => __awaiter(void 0, void 0, void 0, function* () {
                    const source1 = yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern);
                    const source2 = yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern)).toBe(source1);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern)).toBe(source2);
                    listener({});
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern)).not.toBe(source1);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern)).not.toBe(source2);
                }));
                it('should not cache the source with cache size 0', () => __awaiter(void 0, void 0, void 0, function* () {
                    actor = new lib_1.ActorRuleResolveHypermedia({
                        bus: new core_1.Bus({ name: 'bus' }),
                        cacheSize: 0,
                        httpInvalidator,
                        mediatorDereferenceRule: reasoning_mocks_1.mediatorDereferenceRule,
                        name: 'actor',
                    });
                    const source1 = yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern);
                    const source2 = yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules' }), pattern)).not.toBe(source1);
                    expect(yield actor.getSource(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-nested-rules' }), pattern)).not.toBe(source2);
                }));
            });
            describe('run', () => {
                it('should return a rule stream', () => __awaiter(void 0, void 0, void 0, function* () {
                    const { data } = yield actor.run({ context });
                    expect(yield data.toArray()).toHaveLength(2);
                }));
                it('Should error if context does not have a rule reference', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield expect(() => actor.run({ context: new core_1.ActionContext({}) })).rejects.toThrow();
                }));
                // It('should return a quad stream and metadata, with metadata resolving first', async() => {
                //   const { data } = await actor.run({ context, pattern });
                //   expect(await new Promise(resolve => data.getProperty('metadata', resolve)))
                //     .toEqual({ firstMeta: true, a: 1 });
                //   expect(await data.toArray()).toEqualRdfQuadArray([
                //     quad('s1', 'p1', 'o1'),
                //     quad('s2', 'p2', 'o2'),
                //     quad('s3', 'p3', 'o3'),
                //     quad('s4', 'p4', 'o4'),
                //   ]);
            });
        });
    });
});
