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
exports.ActorDereferenceConstantHylarRdfs = void 0;
const bus_dereference_1 = require("@comunica/bus-dereference");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const Streamify = require('streamify-string');
/**
 * A comunica Constant Hylar RDFs Dereference Actor.
 */
class ActorDereferenceConstantHylarRdfs extends bus_dereference_1.ActorDereference {
    constructor(args) {
        super(args);
    }
    test(action) {
        return __awaiter(this, void 0, void 0, function* () {
            if (action.url === reasoning_context_entries_1.KeysRdfDereferenceConstantHylar.rdfs) {
                return true;
            }
            throw new Error(`This actor requires the url to be set to the constant ${reasoning_context_entries_1.KeysRdfDereferenceConstantHylar.rdfs}`);
        });
    }
    run(action) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                data: Streamify(data),
                url: 'rdfs.hylar',
                requestTime: 0,
                exists: true,
            };
        });
    }
}
exports.ActorDereferenceConstantHylarRdfs = ActorDereferenceConstantHylarRdfs;
const data = `
(?uuu ?aaa ?yyy) -> (?aaa rdf:type rdf:Property)
(?aaa rdfs:domain ?xxx) ^ (?uuu ?aaa ?yyy) -> (?uuu rdf:type ?xxx)
(?aaa rdfs:range ?xxx) ^ (?uuu ?aaa ?vvv) -> (?vvv rdf:type ?xxx)
(?uuu ?aaa ?xxx) -> (?uuu rdf:type rdfs:Resource)
(?uuu ?aaa ?vvv) -> (?vvv rdf:type rdfs:Resource)
(?uuu rdfs:subPropertyOf ?vvv) ^ (?vvv rdfs:subPropertyOf ?xxx) -> (?uuu rdfs:subPropertyOf ?xxx)
(?uuu rdf:type rdf:Property) -> (?uuu rdfs:subPropertyOf ?uuu)
(?aaa rdfs:subPropertyOf ?bbb) ^ (?uuu ?aaa ?yyy) -> (?uuu ?bbb ?yyy)
(?uuu rdf:type rdfs:Class) -> (?uuu rdfs:subClassOf rdfs:Resource)
(?uuu rdfs:subClassOf ?xxx) ^ (?vvv rdf:type ?uuu) -> (?vvv rdf:type ?xxx)
(?uuu rdf:type rdfs:Class) -> (?uuu rdfs:subClassOf ?uuu)
(?uuu rdfs:subClassOf ?vvv) ^ (?vvv rdfs:subClassOf ?xxx) -> (?uuu rdfs:subClassOf ?xxx)
(?uuu rdf:type rdfs:ContainerMembershipProperty) -> (?uuu rdfs:subPropertyOf rdfs:member)
(?uuu rdf:type rdfs:Datatype) -> (?uuu rdfs:subClassOf rdfs:Literal)
`;
