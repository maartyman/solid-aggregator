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
exports.ActorDereferenceN3String = void 0;
const bus_dereference_1 = require("@comunica/bus-dereference");
const Streamify = require('streamify-string');
/**
 * A comunica n3 from string Dereference Actor.
 */
class ActorDereferenceN3String extends bus_dereference_1.ActorDereference {
    constructor(args) {
        super(args);
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            const regEx = new RegExp(`(?:\\{(?:\\n*)(?:\\s*` +
                `(?:(?:(?:\\?\\w+)|(?:(?:<https?:\\/\\/)\\S*>)|(?:\\w+:\\w+)|a)\\s*){3}` +
                `\\.\\s*\\n*)+(?:\\n*)\\}\\s*\\n*\\s*=>\\s*\\n*\\s*\\{(?:\\n*)(?:\\s*` +
                `(?:(?:(?:\\?\\w+)|(?:(?:<https?:\\/\\/)\\S*>)|(?:\\w+:\\w+)|a)\\s*){3}` +
                `\\.\\s*\\n*)+(?:\\n*)\\}\\s*\\.)`, `gmu`);
            if (regEx.test(action.url)) {
                return true;
            }
            throw new Error(`This actor requires the url to be set to a N3 string`);
        });
    }
    run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                data: Streamify(action.url),
                url: 'custom.n3',
                requestTime: 0,
                exists: true,
            };
        });
    }
}
exports.ActorDereferenceN3String = ActorDereferenceN3String;
