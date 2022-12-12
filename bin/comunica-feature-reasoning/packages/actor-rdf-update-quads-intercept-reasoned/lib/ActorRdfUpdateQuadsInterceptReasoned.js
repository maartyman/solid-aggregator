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
exports.ActorRdfUpdateQuadsInterceptReasoned = void 0;
const bus_rdf_reason_1 = require("@comunica/bus-rdf-reason");
const bus_rdf_update_quads_intercept_1 = require("@comunica/bus-rdf-update-quads-intercept");
const asynciterator_1 = require("asynciterator");
const n3_1 = require("n3");
const sparqlalgebrajs_1 = require("sparqlalgebrajs");
const { defaultGraph, variable } = n3_1.DataFactory;
const factory = new sparqlalgebrajs_1.Factory();
/**
 * A comunica Reasoned RDF Update Quads Intercept Actor.
 */
class ActorRdfUpdateQuadsInterceptReasoned extends bus_rdf_update_quads_intercept_1.ActorRdfUpdateQuadsIntercept {
    constructor(args) {
        super(args);
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            const actor = yield this.mediatorRdfUpdateQuads.mediateActor(action);
            return actor.test(action);
        });
    }
    run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Remove this logic into an actor on top of the update-quads bus that allows you to
            // view quad updates.
            const getQuadsFromGraph = (graph) => __awaiter(this, void 0, void 0, function* () {
                const { data } = yield this.mediatorRdfResolveQuadPattern.mediate({
                    context: action.context,
                    pattern: factory.createPattern(variable('?s'), variable('?p'), variable('?o'), graph),
                });
                return data;
            });
            function getGraphDeletedQuads(graphs) {
                return __awaiter(this, void 0, void 0, function* () {
                    switch (graphs) {
                        case 'ALL':
                            return getQuadsFromGraph(defaultGraph());
                        case 'NAMED':
                            return (yield getQuadsFromGraph(variable('?g'))).filter(quad => !quad.graph.equals(defaultGraph()));
                        default:
                            if (Array.isArray(graphs)) {
                                // Remove Promise.all usage once https://github.com/RubenVerborgh/AsyncIterator/issues/42 is resolved
                                const iterators = yield Promise.all(graphs.map(graph => getQuadsFromGraph(graph)));
                                return new asynciterator_1.UnionIterator(iterators, { autoStart: false });
                            }
                            return getQuadsFromGraph(graphs);
                    }
                });
            }
            return {
                execute: () => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e;
                    const quadStreamDelete = [
                        ((_a = action.deleteGraphs) === null || _a === void 0 ? void 0 : _a.graphs) && (yield getGraphDeletedQuads(action.deleteGraphs.graphs)),
                        (_b = action.quadStreamDelete) === null || _b === void 0 ? void 0 : _b.clone(),
                    ].filter((x) => x !== undefined);
                    const { execute: executeReasoning } = yield this.mediatorRdfReason.mediate({
                        context: (0, bus_rdf_reason_1.getContextWithImplicitDataset)(action.context),
                        updates: {
                            quadStreamDelete: new asynciterator_1.UnionIterator(quadStreamDelete, { autoStart: false }),
                            quadStreamInsert: (_c = action.quadStreamInsert) === null || _c === void 0 ? void 0 : _c.clone(),
                        },
                    });
                    // Long term actor should start a reasoning lock
                    yield executeReasoning();
                    // Long term the actor should disable a reasoning lock here
                    const { execute } = yield this.mediatorRdfUpdateQuads.mediate(Object.assign(Object.assign({}, action), { 
                        // We need to clone the quad streams prior to the update
                        // so that these streams can be used by the inferencing engine
                        quadStreamInsert: (_d = action.quadStreamInsert) === null || _d === void 0 ? void 0 : _d.clone(), quadStreamDelete: (_e = action.quadStreamDelete) === null || _e === void 0 ? void 0 : _e.clone() }));
                    // We may also need to start/stop an update lock here
                    yield execute();
                }),
            };
        });
    }
}
exports.ActorRdfUpdateQuadsInterceptReasoned = ActorRdfUpdateQuadsInterceptReasoned;
