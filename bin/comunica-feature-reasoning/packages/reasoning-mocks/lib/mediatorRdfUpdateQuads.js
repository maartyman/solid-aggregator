"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediatorRdfUpdateQuads = void 0;
const actor_rdf_update_quads_rdfjs_store_1 = require("@comunica/actor-rdf-update-quads-rdfjs-store");
const util_1 = require("./util");
exports.mediatorRdfUpdateQuads = (0, util_1.createMediator)(actor_rdf_update_quads_rdfjs_store_1.ActorRdfUpdateQuadsRdfJsStore);
