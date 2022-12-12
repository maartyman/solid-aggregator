"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorDereferenceRule = void 0;
const bus_dereference_1 = require("@comunica/bus-dereference");
/**
 * A base actor for dereferencing URLs to rule streams.
 *
 * Actor types:
 * * Input:  IActionDereferenceRule:      A URL.
 * * Test:   <none>
 * * Output: IActorDereferenceRuleOutput: A rule stream.
 *
 * @see IActionDereferenceRule
 * @see IActorDereferenceRuleOutput
 */
class ActorDereferenceRule extends bus_dereference_1.ActorDereferenceParse {
    /**
     * @param args - @defaultNested {<default_bus> a <cc:components/Bus.jsonld#Bus>} bus
     */
    constructor(args) {
        super(args);
    }
}
exports.ActorDereferenceRule = ActorDereferenceRule;
