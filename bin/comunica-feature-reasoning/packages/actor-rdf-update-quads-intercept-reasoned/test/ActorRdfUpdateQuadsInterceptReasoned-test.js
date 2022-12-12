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
const asynciterator_1 = require("asynciterator");
const event_emitter_promisify_1 = require("event-emitter-promisify");
const n3_1 = require("n3");
const lib_1 = require("../lib");
const { namedNode, quad, defaultGraph } = n3_1.DataFactory;
describe('ActorRdfUpdateQuadsInterceptReasoned', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('An ActorRdfUpdateQuadsInterceptReasoned instance', () => {
        let actor;
        let action;
        let source;
        let destination;
        let implicitDestination;
        let reasonGroup;
        let context;
        let execute;
        let quads;
        let insertedDataset;
        let deletedDataset;
        beforeEach(() => {
            source = new n3_1.Store();
            destination = new n3_1.Store();
            implicitDestination = new n3_1.Store();
            reasonGroup = {
                dataset: implicitDestination,
                status: { type: 'full', reasoned: false },
                context: new core_1.ActionContext(),
            };
            context = new core_1.ActionContext({
                [context_entries_1.KeysRdfResolveQuadPattern.sources.name]: [source, destination],
                [context_entries_1.KeysRdfUpdateQuads.destination.name]: destination,
                [reasoning_context_entries_1.KeysRdfReason.data.name]: reasonGroup,
            });
            actor = new lib_1.ActorRdfUpdateQuadsInterceptReasoned({
                name: 'actor',
                bus,
                mediatorRdfReason: {
                    mediate(_action) {
                        return __awaiter(this, void 0, void 0, function* () {
                            return {
                                execute() {
                                    var _a, _b;
                                    return __awaiter(this, void 0, void 0, function* () {
                                        insertedDataset = new n3_1.Store();
                                        deletedDataset = new n3_1.Store();
                                        if ((_a = _action === null || _action === void 0 ? void 0 : _action.updates) === null || _a === void 0 ? void 0 : _a.quadStreamInsert) {
                                            yield (0, event_emitter_promisify_1.promisifyEventEmitter)(insertedDataset.import(_action.updates.quadStreamInsert));
                                        }
                                        if ((_b = _action === null || _action === void 0 ? void 0 : _action.updates) === null || _b === void 0 ? void 0 : _b.quadStreamDelete) {
                                            yield (0, event_emitter_promisify_1.promisifyEventEmitter)(deletedDataset.import(_action.updates.quadStreamDelete));
                                        }
                                    });
                                },
                            };
                        });
                    },
                },
                mediatorRdfResolveQuadPattern: reasoning_mocks_1.mediatorRdfResolveQuadPattern,
                mediatorRdfUpdateQuads: reasoning_mocks_1.mediatorRdfUpdateQuads,
            });
        });
        it('should test true if source and destination are provided', () => {
            return expect(actor.test({ context })).resolves.toEqual(true);
        });
        it('should reject if a destination is not provided provided', () => {
            return expect(actor.test({
                context: new core_1.ActionContext({
                    [context_entries_1.KeysRdfResolveQuadPattern.source.name]: source,
                }),
            })).rejects.toThrowError();
        });
        it('should run', () => __awaiter(void 0, void 0, void 0, function* () {
            execute = (yield actor.run({ context })).execute;
            yield execute();
            expect(destination.getQuads(null, null, null, null)).toEqual([]);
        }));
        describe('Performing inserts', () => {
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                action = {
                    context,
                    quadStreamInsert: (0, asynciterator_1.fromArray)([
                        quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g')),
                    ]),
                };
                execute = (yield actor.run(action)).execute;
            }));
            it('Should not have inserted the quad into the store prior to calling execute', () => {
                expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic([]);
            });
            describe('Post running execute', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield execute();
                }));
                it('Should have inserted the quad into the store', () => {
                    expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                        quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g')),
                    ]);
                });
            });
        });
        describe('Performing deletes', () => {
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                quads = [
                    quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g')),
                    quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g')),
                    quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g1')),
                    quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g1')),
                    quad(namedNode('s'), namedNode('p'), namedNode('o'), defaultGraph()),
                    quad(namedNode('s1'), namedNode('p'), namedNode('o'), defaultGraph()),
                ];
                destination.addQuads(quads);
            }));
            describe('Deleting a single quad', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    action = {
                        context,
                        quadStreamDelete: (0, asynciterator_1.fromArray)([
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g')),
                        ]),
                    };
                    execute = (yield actor.run(action)).execute;
                }));
                it('Should not have deleted the quads prior to calling execute', () => {
                    expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic(quads);
                });
                describe('Post running execute', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield execute();
                    }));
                    it('Should have the correct delta streams', () => {
                        expect(insertedDataset.getQuads(null, null, null, null)).toBeRdfIsomorphic([]);
                        expect(deletedDataset.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g')),
                        ]);
                    });
                    it('Should have deleted the quad from the store', () => {
                        expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g')),
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g1')),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g1')),
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), defaultGraph()),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), defaultGraph()),
                        ]);
                    });
                });
            });
            describe('Deleting a graph', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    action = {
                        context,
                        deleteGraphs: {
                            graphs: [namedNode('g')],
                            requireExistence: true,
                            dropGraphs: true,
                        },
                    };
                    execute = (yield actor.run(action)).execute;
                }));
                it('Should not have deleted the quads prior to calling execute', () => {
                    expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic(quads);
                });
                describe('Post running execute', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield execute();
                    }));
                    it('Should have the correct delta streams', () => {
                        expect(insertedDataset.getQuads(null, null, null, null)).toBeRdfIsomorphic([]);
                        expect(deletedDataset.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g')),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g')),
                        ]);
                    });
                    it('Should have deleted all quads from the graph quad from the store', () => {
                        expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g1')),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g1')),
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), defaultGraph()),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), defaultGraph()),
                        ]);
                    });
                });
            });
            describe('Deleting named graph', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    action = {
                        context,
                        deleteGraphs: {
                            graphs: 'NAMED',
                            requireExistence: true,
                            dropGraphs: true,
                        },
                    };
                    execute = (yield actor.run(action)).execute;
                }));
                it('Should not have deleted the quads prior to calling execute', () => {
                    expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic(quads);
                });
                describe('Post running execute', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield execute();
                    }));
                    it('Should have the correct delta streams', () => {
                        expect(insertedDataset.getQuads(null, null, null, null)).toBeRdfIsomorphic([]);
                        expect(deletedDataset.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g')),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g')),
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g1')),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g1')),
                        ]);
                    });
                    it('Should have deleted all named quads', () => {
                        expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), defaultGraph()),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), defaultGraph()),
                        ]);
                    });
                });
            });
            describe('Deleting all graphs', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    action = {
                        context,
                        deleteGraphs: {
                            graphs: 'ALL',
                            requireExistence: true,
                            dropGraphs: true,
                        },
                    };
                    execute = (yield actor.run(action)).execute;
                }));
                it('Should not have deleted the quads prior to calling execute', () => {
                    expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic(quads);
                });
                describe('Post running execute', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield execute();
                    }));
                    it('Should have deleted all named quads', () => {
                        expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic([]);
                    });
                });
            });
            describe('Deleting default graph', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    action = {
                        context,
                        deleteGraphs: {
                            graphs: defaultGraph(),
                            requireExistence: true,
                            dropGraphs: true,
                        },
                    };
                    execute = (yield actor.run(action)).execute;
                }));
                it('Should not have deleted the quads prior to calling execute', () => {
                    expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic(quads);
                });
                describe('Post running execute', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield execute();
                    }));
                    it('Should have the correct delta streams', () => {
                        expect(insertedDataset.getQuads(null, null, null, null)).toBeRdfIsomorphic([]);
                        expect(deletedDataset.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), defaultGraph()),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), defaultGraph()),
                        ]);
                    });
                    it('Should have deleted all default graph quads', () => {
                        expect(destination.getQuads(null, null, null, null)).toBeRdfIsomorphic([
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g')),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g')),
                            quad(namedNode('s'), namedNode('p'), namedNode('o'), namedNode('g1')),
                            quad(namedNode('s1'), namedNode('p'), namedNode('o'), namedNode('g1')),
                        ]);
                    });
                });
            });
        });
    });
});
