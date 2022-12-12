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
exports.ActorRdfResolveQuadPatternIntercept = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for rdf-resolve-quad-pattern-intercept events.
 *
 * Actor types:
 * * Input:  IActionRdfResolveQuadPatternIntercept:      TODO: fill in.
 * * Test:   <none>
 * * Output: IActorRdfResolveQuadPatternInterceptOutput: TODO: fill in.
 *
 * @see IActionRdfResolveQuadPatternIntercept
 * @see IActorRdfResolveQuadPatternInterceptOutput
 */
class ActorRdfResolveQuadPatternIntercept extends core_1.Actor {
    /**
     * @param args - @defaultNested {<default_bus> a <cc:components/Bus.jsonld#Bus>} bus
     */
    constructor(args) {
        super(args);
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.mediatorRdfResolveQuadPattern.mediate(yield this.runIntercept(action));
        });
    }
}
exports.ActorRdfResolveQuadPatternIntercept = ActorRdfResolveQuadPatternIntercept;
