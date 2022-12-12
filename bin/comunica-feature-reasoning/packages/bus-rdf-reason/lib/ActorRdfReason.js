"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfReason = exports.setReasoningStatus = exports.getContextWithImplicitDataset = exports.setUnionSource = exports.setImplicitSource = exports.setImplicitDestination = exports.getUnionSources = exports.getExplicitSources = exports.getImplicitSource = exports.getSafeData = exports.implicitGroupFactory = exports.implicitDatasetFactory = void 0;
const context_entries_1 = require("@comunica/context-entries");
const core_1 = require("@comunica/core");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
function implicitDatasetFactory(context) {
    const datasetFactory = context.get(reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory);
    if (!datasetFactory) {
        throw new Error(`Missing context entry for ${reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name}`);
    }
    return datasetFactory();
}
exports.implicitDatasetFactory = implicitDatasetFactory;
function implicitGroupFactory(context) {
    return {
        dataset: implicitDatasetFactory(context),
        status: { type: 'full', reasoned: false },
        context: new core_1.ActionContext(),
    };
}
exports.implicitGroupFactory = implicitGroupFactory;
// TODO: Clean up after https://github.com/comunica/comunica-feature-reasoning/issues/945 is closed
function getSafeData(context) {
    const data = context.get(reasoning_context_entries_1.KeysRdfReason.data);
    if (!data) {
        throw new Error(`Context entry ${reasoning_context_entries_1.KeysRdfReason.data.name} is required but not available`);
    }
    return data;
}
exports.getSafeData = getSafeData;
function getImplicitSource(context) {
    return getSafeData(context).dataset;
}
exports.getImplicitSource = getImplicitSource;
function getExplicitSources(context) {
    var _a;
    return context.has(context_entries_1.KeysRdfResolveQuadPattern.source) ?
        [context.get(context_entries_1.KeysRdfResolveQuadPattern.source)] :
        (_a = context.get(context_entries_1.KeysRdfResolveQuadPattern.sources)) !== null && _a !== void 0 ? _a : [];
}
exports.getExplicitSources = getExplicitSources;
function getUnionSources(context) {
    return [...getExplicitSources(context), getImplicitSource(context)];
}
exports.getUnionSources = getUnionSources;
function setImplicitDestination(context) {
    return context.set(context_entries_1.KeysRdfUpdateQuads.destination, getImplicitSource(context));
}
exports.setImplicitDestination = setImplicitDestination;
function setImplicitSource(context) {
    return context
        .delete(context_entries_1.KeysRdfResolveQuadPattern.sources)
        .set(context_entries_1.KeysRdfResolveQuadPattern.source, getImplicitSource(context));
}
exports.setImplicitSource = setImplicitSource;
function setUnionSource(context) {
    return context.delete(context_entries_1.KeysRdfResolveQuadPattern.source)
        .set(context_entries_1.KeysRdfResolveQuadPattern.sources, getUnionSources(context));
}
exports.setUnionSource = setUnionSource;
function getContextWithImplicitDataset(context) {
    // We cannot use 'setDefault' here because implicitGroupFactory will throw an error
    // if there is no implicit dataset factory *even if* we already have a data entry
    return context.has(reasoning_context_entries_1.KeysRdfReason.data) ? context : context.set(reasoning_context_entries_1.KeysRdfReason.data, implicitGroupFactory(context));
}
exports.getContextWithImplicitDataset = getContextWithImplicitDataset;
function setReasoningStatus(context, status) {
    getSafeData(context).status = status;
    return context;
}
exports.setReasoningStatus = setReasoningStatus;
/**
 * A comunica actor for reasoning over RDF data
 *
 * Actor types:
 * * Input:  IActionRdfReason:      TODO: fill in.
 * * Test:   <none>
 * * Output: IActorRdfReasonOutput: TODO: fill in.
 *
 * @see IActionRdfReason
 * @see IActorRdfReasonOutput
 */
class ActorRdfReason extends core_1.Actor {
    /**
     * @param args - @defaultNested {<default_bus> a <cc:components/Bus.jsonld#Bus>} bus
     */
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfReason = ActorRdfReason;
