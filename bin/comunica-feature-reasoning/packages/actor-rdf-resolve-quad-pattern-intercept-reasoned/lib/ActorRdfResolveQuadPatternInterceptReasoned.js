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
exports.ActorRdfResolveQuadPatternInterceptReasoned = void 0;
const bus_rdf_reason_1 = require("@comunica/bus-rdf-reason");
const bus_rdf_resolve_quad_pattern_intercept_1 = require("@comunica/bus-rdf-resolve-quad-pattern-intercept");
/**
 * A comunica Reasoned RDF Resolve Quad Pattern Intercept Actor.
 */
class ActorRdfResolveQuadPatternInterceptReasoned extends bus_rdf_resolve_quad_pattern_intercept_1.ActorRdfResolveQuadPatternIntercept {
    constructor(args) {
        super(args);
    }
    runIntercept(action) {
        return __awaiter(this, void 0, void 0, function* () {
            const context = (0, bus_rdf_reason_1.getContextWithImplicitDataset)(action.context);
            // TODO: Work out how to emit results from other sources while still reasoning
            // this will be done by including the
            const { execute } = yield this.mediatorRdfReason.mediate({ context, pattern: action.pattern });
            // TODO: Put this in a lock
            yield execute();
            return Object.assign(Object.assign({}, action), { context: (0, bus_rdf_reason_1.setUnionSource)(context) });
        });
    }
}
exports.ActorRdfResolveQuadPatternInterceptReasoned = ActorRdfResolveQuadPatternInterceptReasoned;
