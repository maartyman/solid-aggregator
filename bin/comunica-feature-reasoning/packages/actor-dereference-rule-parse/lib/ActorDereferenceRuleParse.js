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
exports.ActorDereferenceRuleParse = void 0;
const bus_dereference_rule_1 = require("@comunica/bus-dereference-rule");
/**
 * A comunica Parse Dereference Rule Actor.
 */
class ActorDereferenceRuleParse extends bus_dereference_rule_1.ActorDereferenceRule {
    /**
     * @param args - @defaultNested {{
     *   "hylar":    "text/hylar",
     *   "ttl":      "text/turtle",
     *   "turtle":   "text/turtle",
     *   "nt":       "application/n-triples",
     *   "ntriples": "application/n-triples",
     *   "nq":       "application/n-quads",
     *   "nquads":   "application/n-quads",
     *   "rdf":      "application/rdf+xml",
     *   "rdfxml":   "application/rdf+xml",
     *   "owl":      "application/rdf+xml",
     *   "n3":       "text/n3",
     *   "trig":     "application/trig",
     *   "jsonld":   "application/ld+json",
     *   "json":     "application/json",
     *   "html":     "text/html",
     *   "htm":      "text/html",
     *   "xhtml":    "application/xhtml+xml",
     *   "xht":      "application/xhtml+xml",
     *   "xml":      "application/xml",
     *   "svg":      "image/svg+xml",
     *   "svgz":     "image/svg+xml"
     * }} mediaMappings
     */
    constructor(args) {
        super(args);
    }
    getMetadata(dereference) {
        return __awaiter(this, void 0, void 0, function* () {
            return { baseIRI: dereference.url };
        });
    }
}
exports.ActorDereferenceRuleParse = ActorDereferenceRuleParse;
