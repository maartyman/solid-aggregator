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
const bus_rdf_reason_1 = require("@comunica/bus-rdf-reason");
const context_entries_1 = require("@comunica/context-entries");
const core_1 = require("@comunica/core");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const reasoning_mocks_1 = require("@comunica/reasoning-mocks");
require("jest-rdf");
const n3_1 = require("n3");
const lib_1 = require("../lib");
const { namedNode, quad } = n3_1.DataFactory;
// TODO: Add tests with blank nodes
describe('ActorRdfReasonRuleRestriction', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('An ActorRdfReasonRuleRestriction instance', () => {
        let actor;
        let action;
        let data;
        let destination;
        let source;
        beforeEach(() => {
            actor = new lib_1.ActorRdfReasonRuleRestriction({
                name: 'actor',
                bus,
                mediatorRdfUpdateQuads: reasoning_mocks_1.mediatorRdfUpdateQuads,
                mediatorRdfResolveQuadPattern: reasoning_mocks_1.mediatorRdfResolveQuadPattern,
                mediatorRuleResolve: reasoning_mocks_1.mediatorRuleResolve,
                mediatorOptimizeRule: reasoning_mocks_1.mediatorOptimizeRule,
            });
            data = (0, bus_rdf_reason_1.implicitGroupFactory)(new core_1.ActionContext({
                [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
            }));
            destination = new n3_1.Store();
            source = new n3_1.Store();
            action = {
                context: new core_1.ActionContext({
                    [reasoning_context_entries_1.KeysRdfReason.data.name]: data,
                    [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'my-unnested-rules',
                    [context_entries_1.KeysRdfUpdateQuads.destination.name]: destination,
                    [context_entries_1.KeysRdfResolveQuadPattern.source.name]: source,
                }),
            };
        });
        // TODO: Implement this
        it('should test', () => {
            return expect(actor.test(action)).resolves.toEqual(true); // TODO
        });
        it('Should error if missing an implicit destination', () => {
            return expect(actor.test(Object.assign(Object.assign({}, action), { context: action.context.delete(reasoning_context_entries_1.KeysRdfReason.data) })))
                .rejects.toThrowError();
        });
        it('should run with no rules and empty data', () => __awaiter(void 0, void 0, void 0, function* () {
            const { execute } = yield actor.run(action);
            yield expect(execute()).resolves.toBeUndefined();
        }));
        it('should run with empty data', () => __awaiter(void 0, void 0, void 0, function* () {
            const { execute } = yield actor.run(action);
            yield execute();
            expect(source).toBeRdfIsomorphic([]);
            expect(destination).toBeRdfIsomorphic([]);
            expect(data.dataset).toBeRdfIsomorphic([]);
        }));
        it('should run with with the fact Jesse a Human and produce implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
            source.addQuad(quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
            const { execute } = yield actor.run(action);
            yield execute();
            expect(source).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human'))]);
            expect(destination).toBeRdfIsomorphic([]);
            expect(data.dataset).toBeRdfIsomorphic([quad(namedNode('http://example.org#Human'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')), quad(namedNode('http://example.org#Class'), namedNode('http://example.org#a'), namedNode('http://example.org#Class'))]);
        }));
        it('should run with with the facts Jesse a Human / human subset of thing and produce implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
            source.addQuad(quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
            source.addQuad(quad(namedNode('http://example.org#Human'), namedNode('http://example.org#subsetOf'), namedNode('http://example.org#Thing')));
            const { execute } = yield actor.run(action);
            yield execute();
            expect(source).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')),
                quad(namedNode('http://example.org#Human'), namedNode('http://example.org#subsetOf'), namedNode('http://example.org#Thing'))]);
            expect(destination).toBeRdfIsomorphic([]);
            expect(data.dataset.size).toEqual(4);
            expect(data.dataset).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing')),
                quad(namedNode('http://example.org#Human'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
                quad(namedNode('http://example.org#Thing'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
                quad(namedNode('http://example.org#Class'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
            ]);
        }));
        it('should run with with the facts Jesse a Human / Ruben a human / human a thing to produce implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
            source.addQuad(quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
            source.addQuad(quad(namedNode('http://example.org#Ruben'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
            source.addQuad(quad(namedNode('http://example.org#Human'), namedNode('http://example.org#subsetOf'), namedNode('http://example.org#Thing')));
            const { execute } = yield actor.run(action);
            yield execute();
            expect(source).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')),
                quad(namedNode('http://example.org#Ruben'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')), quad(namedNode('http://example.org#Human'), namedNode('http://example.org#subsetOf'), namedNode('http://example.org#Thing'))]);
            expect(destination).toBeRdfIsomorphic([]);
            expect(data.dataset.size).toEqual(5);
            expect(data.dataset).toBeRdfIsomorphic([quad(namedNode('http://example.org#Human'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
                quad(namedNode('http://example.org#Class'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
                quad(namedNode('http://example.org#Thing'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')), quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing')),
                quad(namedNode('http://example.org#Ruben'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing')),
            ]);
        }));
        it('should run with with the facts Jesse a Human / Ruben a human to produce implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
            source.addQuad(quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
            source.addQuad(quad(namedNode('http://example.org#Ruben'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
            const { execute } = yield actor.run(action);
            yield execute();
            expect(source).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')),
                quad(namedNode('http://example.org#Ruben'), namedNode('http://example.org#a'), namedNode('http://example.org#Human'))]);
            expect(destination).toBeRdfIsomorphic([]);
            expect(data.dataset.size).toEqual(2);
            expect(data.dataset).toBeRdfIsomorphic([quad(namedNode('http://example.org#Human'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
                quad(namedNode('http://example.org#Class'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
            ]);
        }));
        describe('Using repeated var rules', () => {
            beforeEach(() => {
                action.context = action.context.set(reasoning_context_entries_1.KeysRdfReason.rules, 'my-repeated-var-rules');
            });
            it('should run with with the fact Jesse a Human and produce implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
                source.addQuad(quad(namedNode('http://example.org#S'), namedNode('http://example.org#a'), namedNode('http://example.org#S')));
                const { execute } = yield actor.run(action);
                yield execute();
                expect(source).toBeRdfIsomorphic([quad(namedNode('http://example.org#S'), namedNode('http://example.org#a'), namedNode('http://example.org#S'))]);
                expect(destination).toBeRdfIsomorphic([]);
                expect(data.dataset).toBeRdfIsomorphic([quad(namedNode('http://example.org#S'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing'))]);
            }));
        });
        describe('Using nested rules', () => {
            beforeEach(() => {
                action.context = action.context.set(reasoning_context_entries_1.KeysRdfReason.rules, 'my-nested-rules');
            });
            it('should run with with the fact Jesse a Human and produce implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
                source.addQuad(quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
                const { execute } = yield actor.run(action);
                yield execute();
                expect(source).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human'))]);
                expect(destination).toBeRdfIsomorphic([]);
                expect(data.dataset).toBeRdfIsomorphic([quad(namedNode('http://example.org#Human'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')), quad(namedNode('http://example.org#Class'), namedNode('http://example.org#a'), namedNode('http://example.org#Class'))]);
            }));
            it('should run with with the facts Jesse a Human / human subset of thing and produce implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
                source.addQuad(quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
                source.addQuad(quad(namedNode('http://example.org#Human'), namedNode('http://example.org#subsetOf'), namedNode('http://example.org#Thing')));
                const { execute } = yield actor.run(action);
                yield execute();
                expect(source).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')),
                    quad(namedNode('http://example.org#Human'), namedNode('http://example.org#subsetOf'), namedNode('http://example.org#Thing'))]);
                expect(destination).toBeRdfIsomorphic([]);
                expect(data.dataset.size).toEqual(4);
                expect(data.dataset).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing')),
                    quad(namedNode('http://example.org#Human'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
                    quad(namedNode('http://example.org#Thing'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
                    quad(namedNode('http://example.org#Class'), namedNode('http://example.org#a'), namedNode('http://example.org#Class')),
                ]);
            }));
        });
        describe('Using rules with multiple conclusions', () => {
            beforeEach(() => {
                action.context = action.context.set(reasoning_context_entries_1.KeysRdfReason.rules, 'multi-conclusion-rules');
            });
            it('should run with with the fact Jesse a Human and produce implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
                source.addQuad(quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human')));
                const { execute } = yield actor.run(action);
                yield execute();
                expect(source).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Human'))]);
                expect(destination).toBeRdfIsomorphic([]);
                expect(data.dataset).toBeRdfIsomorphic([quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing1')), quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing2'))]);
            }));
        });
    });
});
