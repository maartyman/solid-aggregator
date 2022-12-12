"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorOptimizeRule = void 0;
const core_1 = require("@comunica/core");
/**
 * A comunica actor for optimizing reasoning rules
 *
 * Actor types:
 * * Input:  IActionOptimizeRule:      TODO: fill in.
 * * Test:   <none>
 * * Output: IActorOptimizeRuleOutput: TODO: fill in.
 *
 * @see IActionOptimizeRule
 * @see IActorOptimizeRuleOutput
 */
class ActorOptimizeRule extends core_1.Actor {
    /**
     * @param args - @defaultNested {<default_bus> a <cc:components/Bus.jsonld#Bus>} bus
     */
    constructor(args) {
        super(args);
    }
}
exports.ActorOptimizeRule = ActorOptimizeRule;
