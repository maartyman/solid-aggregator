"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfUpdateQuadsIntercept = void 0;
const core_1 = require("@comunica/core");
// TODO: Remove this module my using something like 'reasoning groups'
/**
 * A comunica actor for rdf-update-quads-intercept events.
 *
 * Actor types:
 * * Input:  IActionRdfUpdateQuadsIntercept:      TODO: fill in.
 * * Test:   <none>
 * * Output: IActorRdfUpdateQuadsInterceptOutput: TODO: fill in.
 *
 * @see IActionRdfUpdateQuadsIntercept
 * @see IActorRdfUpdateQuadsInterceptOutput
 */
class ActorRdfUpdateQuadsIntercept extends core_1.Actor {
    /**
     * @param args - @defaultNested {<default_bus> a <cc:components/Bus.jsonld#Bus>} bus
     */
    constructor(args) {
        super(args);
    }
}
exports.ActorRdfUpdateQuadsIntercept = ActorRdfUpdateQuadsIntercept;
