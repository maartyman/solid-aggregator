"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRuleParse = void 0;
const actor_abstract_mediatyped_1 = require("@comunica/actor-abstract-mediatyped");
/**
 * A comunica actor for parsing reasoning rules
 *
 * Actor types:
 * * Input:  IActionRuleParse:      A parse input or a media type input.
 * * Test:   <none>
 * * Output: IActorRuleParseOutput: The parsed rules.
 *
 * @see IActionRuleParse
 * @see IActorRuleParseOutput
 */
class ActorRuleParse extends actor_abstract_mediatyped_1.ActorAbstractMediaTyped {
    /**
     * @param args - @defaultNested {<default_bus> a <cc:components/Bus.jsonld#Bus>} bus
     */
    constructor(args) {
        super(args);
    }
}
exports.ActorRuleParse = ActorRuleParse;
