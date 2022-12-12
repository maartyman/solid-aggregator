"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeysRdfDereferenceConstantHylar = exports.KeysRdfReason = void 0;
const core_1 = require("@comunica/core");
exports.KeysRdfReason = {
    /**
     * The data to reason over in the *current context*.
     */
    data: new core_1.ActionContextKey('@comunica/bus-rdf-reason:data'),
    /**
     * The rules to use for reasoning in the *current context*
     */
    rules: new core_1.ActionContextKey('@comunica/bus-rdf-reason:rules'),
    /**
     * A factory to generate new implicit datasets
     */
    implicitDatasetFactory: new core_1.ActionContextKey('@comunica/bus-rdf-reason:implicitDatasetFactory'),
};
exports.KeysRdfDereferenceConstantHylar = {
    rdfs: '@comunica/bus-rdf-dereference:constant-hylar-rdfs',
    owl2rl: '@comunica/bus-rdf-dereference:constant-hylar-owl2rl',
};
