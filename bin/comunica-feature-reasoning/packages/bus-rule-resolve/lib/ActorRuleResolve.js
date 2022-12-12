"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRuleResolve = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for resolving rules.
 *
 * Actor types:
 * * Input:  IActionRuleResolve:      A quad pattern and an optional context.
 * * Test:   <none>
 * * Output: IActorRuleResolveOutput: The resulting rule stream.
 *
 * @see IActionRuleResolve
 * @see IActorRuleResolveOutput
 */
class ActorRuleResolve extends core_1.Actor {
    /**
     * @param args - @defaultNested {<default_bus> a <cc:components/Bus.jsonld#Bus>} bus
     */
    constructor(args) {
        super(args);
    }
}
exports.ActorRuleResolve = ActorRuleResolve;
