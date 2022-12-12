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
exports.mediatorRdfReason = void 0;
const bus_rdf_reason_1 = require("@comunica/bus-rdf-reason");
// Returns a promise that resolves after timeout milliseconds.
function timedPromise(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
exports.mediatorRdfReason = {
    mediate(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return { execute() {
                    return __awaiter(this, void 0, void 0, function* () {
                        (0, bus_rdf_reason_1.setReasoningStatus)(action.context, { type: 'full', done: timedPromise(10), reasoned: true });
                    });
                } };
        });
    },
};
