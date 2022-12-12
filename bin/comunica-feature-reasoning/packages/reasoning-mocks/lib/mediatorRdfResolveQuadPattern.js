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
exports.mediatorRdfResolveQuadPattern = void 0;
const actor_rdf_resolve_quad_pattern_rdfjs_source_1 = require("@comunica/actor-rdf-resolve-quad-pattern-rdfjs-source");
const context_entries_1 = require("@comunica/context-entries");
const asynciterator_1 = require("asynciterator");
const util_1 = require("./util");
// Const federatedActor = new ActorRdfResolveQuadPatternFederated({
//   name: 'federated',
//   bus: new Bus({ name: 'bus' }),
//   mediatorResolveQuadPattern: createMediator(ActorRdfResolveQuadPatternRdfJsSource)
//  });
class MyActor extends actor_rdf_resolve_quad_pattern_rdfjs_source_1.ActorRdfResolveQuadPatternRdfJsSource {
    constructor(args) {
        super(args);
    }
    run(action) {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const sources = action.context.get(context_entries_1.KeysRdfResolveQuadPattern.source) ?
                [action.context.get(context_entries_1.KeysRdfResolveQuadPattern.source)] :
                (_a = action.context.get(context_entries_1.KeysRdfResolveQuadPattern.sources)) !== null && _a !== void 0 ? _a : [];
            const its = sources.map(source => _super.run.call(this, Object.assign(Object.assign({}, action), { context: action.context.set(context_entries_1.KeysRdfResolveQuadPattern.source, source) })));
            return {
                data: new asynciterator_1.UnionIterator((yield Promise.all(its)).map(it => it.data), { autoStart: false }),
            };
        });
    }
}
exports.mediatorRdfResolveQuadPattern = (0, util_1.createMediator)(MyActor);
