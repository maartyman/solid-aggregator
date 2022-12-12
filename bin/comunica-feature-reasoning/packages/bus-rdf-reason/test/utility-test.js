"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_entries_1 = require("@comunica/context-entries");
const core_1 = require("@comunica/core");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const n3_1 = require("n3");
const ActorRdfReason_1 = require("../lib/ActorRdfReason");
const { namedNode, quad } = n3_1.DataFactory;
describe('getContextWithImplicitDataset', () => {
    let store;
    let factory;
    let data;
    beforeEach(() => {
        store = new n3_1.Store();
        data = {
            dataset: store,
            status: { type: 'full', reasoned: false },
            context: new core_1.ActionContext(),
        };
        factory = () => new n3_1.Store();
    });
    it('Should throw an error if there is no data object or source generator', () => {
        expect(() => (0, ActorRdfReason_1.getContextWithImplicitDataset)(new core_1.ActionContext())).toThrowError();
    });
    it('Should keep the original data key object if one is present', () => {
        var _a, _b;
        let context = new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.data.name]: data });
        let newContext = (0, ActorRdfReason_1.getContextWithImplicitDataset)(context);
        expect(context).toEqual(newContext);
        expect(((_a = newContext.get(reasoning_context_entries_1.KeysRdfReason.data)) === null || _a === void 0 ? void 0 : _a.dataset) === store).toEqual(true);
        context = new core_1.ActionContext({
            [reasoning_context_entries_1.KeysRdfReason.data.name]: data,
            [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: factory,
        });
        newContext = (0, ActorRdfReason_1.getContextWithImplicitDataset)(context);
        expect(context).toEqual(newContext);
        expect(((_b = newContext.get(reasoning_context_entries_1.KeysRdfReason.data)) === null || _b === void 0 ? void 0 : _b.dataset) === store).toEqual(true);
    });
    it('Should generate a data object if none are present', () => {
        var _a;
        const context = new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: factory });
        expect((0, ActorRdfReason_1.getContextWithImplicitDataset)(context).get(reasoning_context_entries_1.KeysRdfReason.data)).toBeDefined();
        expect((_a = (0, ActorRdfReason_1.getContextWithImplicitDataset)(context).get(reasoning_context_entries_1.KeysRdfReason.data)) === null || _a === void 0 ? void 0 : _a.dataset).toBeInstanceOf(n3_1.Store);
    });
    describe('setImplicitSource', () => {
        let context;
        let indicatorQuad;
        beforeEach(() => {
            context = new core_1.ActionContext({
                [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: factory,
                [reasoning_context_entries_1.KeysRdfReason.data.name]: data,
            });
            indicatorQuad = quad(namedNode('http://example.org/subject'), namedNode('http://example.org/predicate'), namedNode('http://example.org/object'), namedNode('http://example.org/graph'));
            store.addQuad(indicatorQuad);
        });
        it('With no original source or sources', () => {
            var _a;
            const newContext = (0, ActorRdfReason_1.setImplicitSource)(context);
            expect((_a = newContext.get(reasoning_context_entries_1.KeysRdfReason.data)) === null || _a === void 0 ? void 0 : _a.dataset).toBeRdfDatasetContaining(indicatorQuad);
            expect(newContext.get(context_entries_1.KeysRdfResolveQuadPattern.source)).toBeRdfDatasetContaining(indicatorQuad);
            expect(newContext.has(context_entries_1.KeysRdfResolveQuadPattern.sources)).toEqual(false);
        });
        it('With a original source but no sources', () => {
            var _a;
            const newContext = (0, ActorRdfReason_1.setImplicitSource)(context.set(context_entries_1.KeysRdfResolveQuadPattern.source, new n3_1.Store()));
            expect((_a = newContext.get(reasoning_context_entries_1.KeysRdfReason.data)) === null || _a === void 0 ? void 0 : _a.dataset).toBeRdfDatasetContaining(indicatorQuad);
            expect(newContext.get(context_entries_1.KeysRdfResolveQuadPattern.source)).toBeRdfDatasetContaining(indicatorQuad);
            expect(newContext.has(context_entries_1.KeysRdfResolveQuadPattern.sources)).toEqual(false);
        });
        it('With original sources but no source', () => {
            var _a;
            const newContext = (0, ActorRdfReason_1.setImplicitSource)(context.set(context_entries_1.KeysRdfResolveQuadPattern.sources, [new n3_1.Store(), new n3_1.Store()]));
            expect((_a = newContext.get(reasoning_context_entries_1.KeysRdfReason.data)) === null || _a === void 0 ? void 0 : _a.dataset).toBeRdfDatasetContaining(indicatorQuad);
            expect(newContext.get(context_entries_1.KeysRdfResolveQuadPattern.source)).toBeRdfDatasetContaining(indicatorQuad);
            expect(newContext.has(context_entries_1.KeysRdfResolveQuadPattern.sources)).toEqual(false);
        });
        it('With original sources and source', () => {
            var _a;
            const newContext = (0, ActorRdfReason_1.setImplicitSource)(context
                .set(context_entries_1.KeysRdfResolveQuadPattern.sources, [new n3_1.Store(), new n3_1.Store()])
                .set(context_entries_1.KeysRdfResolveQuadPattern.source, new n3_1.Store()));
            expect((_a = newContext.get(reasoning_context_entries_1.KeysRdfReason.data)) === null || _a === void 0 ? void 0 : _a.dataset).toBeRdfDatasetContaining(indicatorQuad);
            expect(newContext.get(context_entries_1.KeysRdfResolveQuadPattern.source)).toBeRdfDatasetContaining(indicatorQuad);
            expect(newContext.has(context_entries_1.KeysRdfResolveQuadPattern.sources)).toEqual(false);
        });
    });
    describe('getSafeData', () => {
        it('Should run if the data is available', () => {
            expect((0, ActorRdfReason_1.getSafeData)(new core_1.ActionContext({ [reasoning_context_entries_1.KeysRdfReason.data.name]: data }))).toEqual(data);
        });
        it('Should eror if the data is available', () => {
            expect(() => (0, ActorRdfReason_1.getSafeData)(new core_1.ActionContext())).toThrowError();
        });
    });
    describe('getExplicitSources', () => {
        expect((0, ActorRdfReason_1.getExplicitSources)(new core_1.ActionContext())).toEqual([]);
        expect((0, ActorRdfReason_1.getExplicitSources)(new core_1.ActionContext({
            [context_entries_1.KeysRdfResolveQuadPattern.source.name]: 'source1',
        }))).toEqual(['source1']);
        expect((0, ActorRdfReason_1.getExplicitSources)(new core_1.ActionContext({
            [context_entries_1.KeysRdfResolveQuadPattern.sources.name]: ['source0', 'source2'],
        }))).toEqual(['source0', 'source2']);
        // TODO: Address this case
        // expect(getExplicitSources(new ActionContext({
        //   [KeysRdfResolveQuadPattern.source.name]: 'source1',
        //   [KeysRdfResolveQuadPattern.sources.name]: ['source0', 'source2']
        // }))).toEqual(['source0', 'source2']);
    });
});
