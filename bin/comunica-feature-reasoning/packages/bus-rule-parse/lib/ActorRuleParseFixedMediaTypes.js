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
exports.ActorRuleParseFixedMediaTypes = void 0;
const actor_abstract_mediatyped_1 = require("@comunica/actor-abstract-mediatyped");
/**
 * A base actor for listening to Rule parse events that has fixed media types.
 *
 * Actor types:
 * * Input:  IActionRuleParseOrMediaType:      A parse input or a media type input.
 * * Test:   <none>
 * * Output: IActorOutputRuleParseOrMediaType: The parsed quads.
 *
 * @see IActionInit
 */
class ActorRuleParseFixedMediaTypes extends actor_abstract_mediatyped_1.ActorAbstractMediaTypedFixed {
    /* eslint-disable max-len */
    /**
     * TODO: rm this (and eslint-disable) once we remove the abstract media typed actor
     * @param args - @defaultNested {<cbrp:components/ActorRuleParse.jsonld#ActorRuleParse_default_bus> a <cc:components/Bus.jsonld#Bus>} bus
     */
    constructor(args) {
        super(args);
    }
    /* eslint-enable max-len */
    testHandleChecked(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
}
exports.ActorRuleParseFixedMediaTypes = ActorRuleParseFixedMediaTypes;
