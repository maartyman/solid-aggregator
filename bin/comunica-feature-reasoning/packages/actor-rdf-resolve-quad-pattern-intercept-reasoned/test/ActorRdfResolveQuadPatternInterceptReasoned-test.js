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
const context_entries_1 = require("@comunica/context-entries");
const core_1 = require("@comunica/core");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const reasoning_mocks_1 = require("@comunica/reasoning-mocks");
const n3_1 = require("n3");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const lib_1 = require("../lib");
const { namedNode, quad, variable } = n3_1.DataFactory;
const factory = new sparqlalgebrajs_1.Factory();
describe('ActorRdfResolveQuadPatternInterceptReasoned', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('An ActorRdfResolveQuadPatternInterceptReasoned instance', () => {
        let actor;
        let source1;
        let source2;
        let action;
        let actionMultiSource;
        beforeEach(() => {
            actor = new lib_1.ActorRdfResolveQuadPatternInterceptReasoned({
                name: 'actor',
                bus,
                mediatorRdfReason: reasoning_mocks_1.mediatorRdfReason,
                mediatorRdfResolveQuadPattern: reasoning_mocks_1.mediatorRdfResolveQuadPattern,
            });
            const pattern = factory.createPattern(variable('?s'), variable('?p'), variable('?o'), variable('?g'));
            source1 = new n3_1.Store([
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Person')),
            ]);
            source2 = new n3_1.Store([
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing')),
            ]);
            const context = new core_1.ActionContext({
                [context_entries_1.KeysRdfResolveQuadPattern.source.name]: source1,
                [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
            });
            const contextMultiSource = new core_1.ActionContext({
                [context_entries_1.KeysRdfResolveQuadPattern.sources.name]: [source1, source2],
                [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
            });
            action = { context, pattern };
            actionMultiSource = { context: contextMultiSource, pattern };
        });
        it('should test', () => {
            return expect(actor.test(action)).resolves.toEqual(true);
        });
        it('should run without implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = yield actor.run(action);
            expect(yield data.toArray()).toEqual([
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Person')),
            ]);
        }));
        it('should run with implicit data', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = yield actor.run(Object.assign(Object.assign({}, action), { context: action.context.set(reasoning_context_entries_1.KeysRdfReason.data, {
                    dataset: new n3_1.Store([
                        quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Agent')),
                    ]),
                }) }));
            expect(yield data.toArray()).toEqual([
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Person')),
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Agent')),
            ]);
        }));
        it('should test (multiple sources)', () => {
            return expect(actor.test(actionMultiSource)).resolves.toEqual(true);
        });
        it('should run without implicit data (multiple sources)', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = yield actor.run(actionMultiSource);
            expect(yield data.toArray()).toEqual([
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Person')),
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing')),
            ]);
        }));
        it('should run with implicit data (multiple sources)', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = yield actor.run(Object.assign(Object.assign({}, action), { context: actionMultiSource.context.set(reasoning_context_entries_1.KeysRdfReason.data, {
                    dataset: new n3_1.Store([
                        quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Agent')),
                    ]),
                }) }));
            expect(yield data.toArray()).toEqual([
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Person')),
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Thing')),
                quad(namedNode('http://example.org#Jesse'), namedNode('http://example.org#a'), namedNode('http://example.org#Agent')),
            ]);
        }));
    });
});
