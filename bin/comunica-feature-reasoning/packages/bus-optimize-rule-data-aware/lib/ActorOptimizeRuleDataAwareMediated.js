"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorOptimizeRuleDataAwareMediated = void 0;
const ActorOptimizeRuleDataAware_1 = require("./ActorOptimizeRuleDataAware");
/**
 * A comunica actor for optimize-rule-data-aware events.
 *
 * Actor types:
 * * Input:  IActionOptimizeRuleDataAware:      TODO: fill in.
 * * Test:   <none>
 * * Output: IActorOptimizeRuleDataAwareOutput: TODO: fill in.
 *
 * @see IActionOptimizeRuleDataAware
 * @see IActorOptimizeRuleDataAwareOutput
 */
class ActorOptimizeRuleDataAwareMediated extends ActorOptimizeRuleDataAware_1.ActorOptimizeRuleDataAware {
    // TODO: Sort mediation
    constructor(args) {
        super(args);
    }
}
exports.ActorOptimizeRuleDataAwareMediated = ActorOptimizeRuleDataAwareMediated;
