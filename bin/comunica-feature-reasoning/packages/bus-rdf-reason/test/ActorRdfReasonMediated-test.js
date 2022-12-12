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
require("jest-rdf");
const n3_1 = require("n3");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const lib_1 = require("../lib");
const ActorRdfReason_1 = require("../lib/ActorRdfReason");
const { namedNode, quad, variable } = n3_1.DataFactory;
const factory = new sparqlalgebrajs_1.Factory();
class MyClass extends lib_1.ActorRdfReasonMediated {
    constructor(args) {
        super(args);
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    execute(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve();
        });
    }
}
// TODO: Test resolution of promises
describe('ActorRdfReasonMediated', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('An ActorRdfReasonMediated instance', () => {
        let actor;
        let action;
        let data;
        let destination;
        let source;
        let execute;
        beforeEach(() => {
            actor = new MyClass({
                name: 'actor',
                bus,
                mediatorOptimizeRule: reasoning_mocks_1.mediatorOptimizeRule,
                mediatorRdfResolveQuadPattern: reasoning_mocks_1.mediatorRdfResolveQuadPattern,
                mediatorRdfUpdateQuads: reasoning_mocks_1.mediatorRdfUpdateQuads,
                mediatorRuleResolve: reasoning_mocks_1.mediatorRuleResolve,
            });
            data = (0, ActorRdfReason_1.implicitGroupFactory)(new core_1.ActionContext({
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
        it('Should always test true - since that what we have declared our mock class should do', () => {
            return expect(actor.test(action)).resolves.toEqual(true);
        });
        describe('The actor has been run but not executed', () => {
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                execute = (yield actor.run(action)).execute;
            }));
            it('Should not be reasoned if execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(data.status).toMatchObject({ type: 'full', reasoned: false });
            }));
            describe('The actor has been run and executed', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield execute();
                }));
                it('Should be reasoned after execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect(data.status).toMatchObject(({ type: 'full', reasoned: true, done: Promise.resolve() }));
                }));
            });
        });
        describe('The actor has been run but not executed [on a fully reasoned source]', () => {
            let reasoningStatus;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                reasoningStatus = { type: 'full', reasoned: true, done: Promise.resolve() };
                (0, ActorRdfReason_1.setReasoningStatus)(action.context, reasoningStatus);
                execute = (yield actor.run(action)).execute;
            }));
            it('Should not be reasoned if execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(data.status).toMatchObject({ type: 'full', reasoned: true, done: Promise.resolve() });
            }));
            describe('The actor has been run and executed', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield execute();
                }));
                it('Should be reasoned after execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect(data.status).toMatchObject(reasoningStatus);
                    expect(data.status).toEqual(reasoningStatus);
                    expect(data.status === reasoningStatus).toBe(true);
                }));
            });
        });
        describe('The actor has been run but not executed [on a fully reasoned source, with action pattern]', () => {
            let reasoningStatus;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                reasoningStatus = { type: 'full', reasoned: true, done: Promise.resolve() };
                (0, ActorRdfReason_1.setReasoningStatus)(action.context, reasoningStatus);
                execute = (yield actor.run(Object.assign(Object.assign({}, action), { pattern: factory.createPattern(variable('s'), namedNode('http://example.org#type'), variable('?o')) }))).execute;
            }));
            it('Should not be reasoned if execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(data.status).toMatchObject({ type: 'full', reasoned: true, done: Promise.resolve() });
            }));
            describe('The actor has been run and executed', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield execute();
                }));
                it('Should be reasoned after execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect(data.status).toMatchObject(reasoningStatus);
                    expect(data.status).toEqual(reasoningStatus);
                    expect(data.status === reasoningStatus).toBe(true);
                }));
            });
        });
        describe('The actor has been run but not executed [on a source with fully reasoned false]', () => {
            let reasoningStatus;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                reasoningStatus = { type: 'full', reasoned: false };
                (0, ActorRdfReason_1.setReasoningStatus)(action.context, reasoningStatus);
                execute = (yield actor.run(action)).execute;
            }));
            it('Should not be reasoned if execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(data.status).toMatchObject(reasoningStatus);
            }));
            describe('The actor has been run and executed', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield execute();
                }));
                it('Should be reasoned after execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect(data.status).toMatchObject({ type: 'full', reasoned: true, done: Promise.resolve() });
                }));
            });
        });
        describe('The actor has been run but not executed [on a source with fully reasoned false, with action pattern]', () => {
            let reasoningStatus;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                reasoningStatus = { type: 'full', reasoned: false };
                (0, ActorRdfReason_1.setReasoningStatus)(action.context, reasoningStatus);
                execute = (yield actor.run(Object.assign(Object.assign({}, action), { pattern: factory.createPattern(variable('s'), namedNode('http://example.org#type'), variable('?o')) }))).execute;
            }));
            it('Should not be reasoned if execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(data.status).toMatchObject(reasoningStatus);
            }));
            describe('The actor has been run and executed', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield execute();
                }));
                it('Should have partial reasoning applied', () => {
                    const { status } = data;
                    expect(status.type).toEqual('partial');
                    const { patterns } = status;
                    expect(patterns.size).toEqual(1);
                    const [[term, state]] = patterns.entries();
                    expect(term.equals(quad(variable('s'), namedNode('http://example.org#type'), variable('?o')))).toBe(true);
                    expect(state).toMatchObject({ type: 'full', reasoned: true, done: Promise.resolve() });
                });
            });
        });
        describe('Testing the actor on a pattern', () => {
            beforeEach(() => {
                action = Object.assign(Object.assign({}, action), { pattern: factory.createPattern(variable('s'), namedNode('http://example.org#type'), variable('?o')) });
            });
            it('Should be able to test the actor on a patterned action', () => {
                return expect(actor.test(action)).resolves.toEqual(true);
            });
            it('Should be full not reasoned before the run action is called', () => {
                expect(data.status).toMatchObject({ type: 'full', reasoned: false });
            });
            describe('.run is called but execute is not yet run', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    execute = (yield actor.run(action)).execute;
                }));
                it('Should be full not reasoned before the run action is called', () => {
                    expect(data.status).toMatchObject({ type: 'full', reasoned: false });
                });
                describe('execute is called', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield execute();
                    }));
                    it('Should have partial reasoning applied', () => {
                        const { status } = data;
                        expect(status.type).toEqual('partial');
                        const { patterns } = status;
                        expect(patterns.size).toEqual(1);
                        const [[term, state]] = patterns.entries();
                        expect(term.equals(quad(variable('s'), namedNode('http://example.org#type'), variable('?o')))).toBe(true);
                        expect(state).toMatchObject({ type: 'full', reasoned: true, done: Promise.resolve() });
                    });
                });
            });
        });
        describe('Testing the actor on overlapping patterns ?s type thing and s type ?o', () => {
            let actionRestricted;
            let executeRestricted;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                actionRestricted = Object.assign(Object.assign({}, action), { pattern: factory.createPattern(variable('s'), namedNode('http://example.org#type'), namedNode('http://example.org#thing')) });
                action = Object.assign(Object.assign({}, action), { pattern: factory.createPattern(variable('s'), namedNode('http://example.org#type'), variable('?o')) });
                executeRestricted = (yield actor.run(actionRestricted)).execute;
                execute = (yield actor.run(action)).execute;
            }));
            it('Should be full not reasoned before the run action is called', () => {
                expect(data.status).toMatchObject({ type: 'full', reasoned: false });
            });
            describe('executeRestricted is called', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield execute();
                }));
                it('Should have partial reasoning applied', () => {
                    const { status } = data;
                    expect(status.type).toEqual('partial');
                    const { patterns } = status;
                    expect(patterns.size).toEqual(1);
                    const [[term, state]] = patterns.entries();
                    expect(term.equals(quad(variable('s'), namedNode('http://example.org#type'), variable('?o')))).toBe(true);
                    expect(state).toMatchObject({ type: 'full', reasoned: true, done: Promise.resolve() });
                });
                describe('execute is called', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield executeRestricted();
                    }));
                    it('Should not have applied any further reasoning', () => {
                        const { status } = data;
                        expect(status.type).toEqual('partial');
                        const { patterns } = status;
                        expect(patterns.size).toEqual(1);
                        const [[term, state]] = patterns.entries();
                        expect(term.equals(quad(variable('s'), namedNode('http://example.org#type'), variable('?o')))).toBe(true);
                        expect(state).toMatchObject({ type: 'full', reasoned: true, done: Promise.resolve() });
                    });
                });
            });
        });
        describe('Testing the actor on overlapping patterns ?s type ?s and ?s type ?o', () => {
            let actionRestricted;
            let executeRestricted;
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                actionRestricted = Object.assign(Object.assign({}, action), { pattern: factory.createPattern(variable('s'), namedNode('http://example.org#type'), namedNode('s')) });
                action = Object.assign(Object.assign({}, action), { pattern: factory.createPattern(variable('s'), namedNode('http://example.org#type'), variable('?o')) });
                executeRestricted = (yield actor.run(actionRestricted)).execute;
                execute = (yield actor.run(action)).execute;
            }));
            it('Should be full not reasoned before the run action is called', () => {
                expect(data.status).toMatchObject({ type: 'full', reasoned: false });
            });
            describe('executeRestricted is called', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield executeRestricted();
                }));
                describe('execute is called', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield execute();
                    }));
                    it('Should have applied further reasoning', () => {
                        const { status } = data;
                        expect(status.type).toEqual('partial');
                        const { patterns } = status;
                        expect(patterns.size).toEqual(2);
                    });
                });
            });
        });
        describe('Testing the actor on an update query action and unreasoned', () => {
            beforeEach(() => {
                action = Object.assign(Object.assign({}, action), { updates: {
                        quadStreamInsert: (0, asynciterator_1.fromArray)([
                            quad(namedNode('http://example.org#s'), namedNode('http://example.org#p'), namedNode('http://example.org#o')),
                        ]),
                    } });
            });
            describe('The actor has been run but not executed (with no reasoning yet applied)', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    execute = (yield actor.run(action)).execute;
                }));
                it('Should not be reasoned if execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect(data.status).toMatchObject({ type: 'full', reasoned: false });
                }));
                describe('The actor has been run and executed', () => {
                    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                        yield execute();
                    }));
                    it('Should be reasoned after execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                        expect(data.status).toMatchObject(({
                            type: 'full',
                            reasoned: true,
                            done: Promise.resolve(),
                        }));
                    }));
                });
            });
        });
        describe('The actor has been run but not executed (starting in a partial reasoned status)', () => {
            beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                (0, ActorRdfReason_1.setReasoningStatus)(action.context, { type: 'partial', patterns: new Map() });
                execute = (yield actor.run(action)).execute;
            }));
            it('Should not be reasoned if execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                expect(data.status).toMatchObject({ type: 'partial', patterns: new Map() });
            }));
            describe('The actor has been run and executed', () => {
                beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield execute();
                }));
                it('Should be reasoned after execute is not called', () => __awaiter(void 0, void 0, void 0, function* () {
                    expect(data.status).toMatchObject(({ type: 'full', reasoned: true, done: Promise.resolve() }));
                }));
            });
        });
    });
});
