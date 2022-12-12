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
exports.mediatorDereferenceRule = void 0;
const asynciterator_1 = require("asynciterator");
const mediatorRuleResolve_1 = require("./mediatorRuleResolve");
exports.mediatorDereferenceRule = {
    mediate(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                data: (0, asynciterator_1.fromArray)(mediatorRuleResolve_1.RULES[action.url]),
            };
        });
    },
};
