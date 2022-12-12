"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediators = exports.mediatorDereferenceRule = exports.mediatorRdfParse = exports.mediatorRuleResolve = exports.mediatorRdfUpdateQuads = exports.mediatorRdfReason = exports.mediatorRdfResolveQuadPattern = exports.mediatorOptimizeRule = void 0;
const mediatorDereferenceRule_1 = require("./mediatorDereferenceRule");
Object.defineProperty(exports, "mediatorDereferenceRule", { enumerable: true, get: function () { return mediatorDereferenceRule_1.mediatorDereferenceRule; } });
const mediatorOptimizeRule_1 = require("./mediatorOptimizeRule");
Object.defineProperty(exports, "mediatorOptimizeRule", { enumerable: true, get: function () { return mediatorOptimizeRule_1.mediatorOptimizeRule; } });
const mediatorRdfParse_1 = require("./mediatorRdfParse");
Object.defineProperty(exports, "mediatorRdfParse", { enumerable: true, get: function () { return mediatorRdfParse_1.mediatorRdfParse; } });
const mediatorRdfReason_1 = require("./mediatorRdfReason");
Object.defineProperty(exports, "mediatorRdfReason", { enumerable: true, get: function () { return mediatorRdfReason_1.mediatorRdfReason; } });
const mediatorRdfResolveQuadPattern_1 = require("./mediatorRdfResolveQuadPattern");
Object.defineProperty(exports, "mediatorRdfResolveQuadPattern", { enumerable: true, get: function () { return mediatorRdfResolveQuadPattern_1.mediatorRdfResolveQuadPattern; } });
const mediatorRdfUpdateQuads_1 = require("./mediatorRdfUpdateQuads");
Object.defineProperty(exports, "mediatorRdfUpdateQuads", { enumerable: true, get: function () { return mediatorRdfUpdateQuads_1.mediatorRdfUpdateQuads; } });
const mediatorRuleResolve_1 = require("./mediatorRuleResolve");
Object.defineProperty(exports, "mediatorRuleResolve", { enumerable: true, get: function () { return mediatorRuleResolve_1.mediatorRuleResolve; } });
exports.mediators = {
    mediatorOptimizeRule: mediatorOptimizeRule_1.mediatorOptimizeRule,
    mediatorRdfResolveQuadPattern: mediatorRdfResolveQuadPattern_1.mediatorRdfResolveQuadPattern,
    mediatorRdfReason: mediatorRdfReason_1.mediatorRdfReason,
    mediatorRdfUpdateQuads: mediatorRdfUpdateQuads_1.mediatorRdfUpdateQuads,
    mediatorRuleResolve: mediatorRuleResolve_1.mediatorRuleResolve,
    mediatorRdfParse: mediatorRdfParse_1.mediatorRdfParse,
    mediatorDereferenceRule: mediatorDereferenceRule_1.mediatorDereferenceRule,
};
