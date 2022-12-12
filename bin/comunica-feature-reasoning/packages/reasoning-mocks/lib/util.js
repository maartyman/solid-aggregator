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
exports.createMediator = void 0;
const core_1 = require("@comunica/core");
// Creates a mediator from a single actor
function createMediator(ActorClass) {
    const actor = new ActorClass({
        bus: new core_1.Bus({ name: 'bus' }),
        name: 'actor',
    });
    return {
        mediate(action) {
            return __awaiter(this, void 0, void 0, function* () {
                return actor.run(action);
            });
        },
        mediateActor(action) {
            return __awaiter(this, void 0, void 0, function* () {
                yield actor.test(action);
                return actor;
            });
        },
        publish(action) {
            return [{ actor, reply: actor.test(action) }];
        },
    };
}
exports.createMediator = createMediator;
