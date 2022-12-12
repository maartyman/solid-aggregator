"use strict";
/** @jest-environment setup-polly-jest/jest-environment-node */
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
// Needed to undo automock from actor-http-native, cleaner workarounds do not appear to be working.
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const n3_1 = require("n3");
const rdf_data_factory_1 = require("rdf-data-factory");
const QueryEngine_1 = require("../lib/QueryEngine");
const util_1 = require("./util");
jest.unmock('follow-redirects');
const DF = new rdf_data_factory_1.DataFactory();
describe('System test: QuerySparqlReasoning', () => {
    const pollyContext = (0, util_1.mockHttp)();
    let engine;
    beforeEach(() => {
        engine = new QueryEngine_1.QueryEngine();
        pollyContext.polly.server.any().on('beforePersist', (req, recording) => {
            recording.request.headers = recording.request.headers.filter(({ name }) => name !== 'user-agent');
        });
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield pollyContext.polly.flush();
    }));
    describe('query', () => {
        describe('simple SPO', () => {
            it('should return a single triple', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield engine.queryBindings('SELECT * WHERE { ?s ?p ?o }', {
                    [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
                    // eslint-disable-next-line max-len
                    [reasoning_context_entries_1.KeysRdfReason.rules.name]: 'https://gist.githubusercontent.com/jeswr/e914df85df0b3d39cfc42f462770ed87/raw/ffd9f5bd6638d8db3d57d2cf4f96e6d003328ac5/rdfs.hylar',
                    sources: [new n3_1.Store([
                            DF.quad(DF.namedNode('http://example.org/s'), DF.namedNode('http://example.org/p'), DF.namedNode('http://example.org/o')),
                        ])],
                });
                expect((yield result.toArray()).length).toEqual(15);
            }));
            it('rdfs rules on timbl and foaf', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield engine.queryBindings('SELECT * WHERE { <https://www.w3.org/People/Berners-Lee/card#i> a ?o }', {
                    [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
                    [reasoning_context_entries_1.KeysRdfReason.rules.name]: reasoning_context_entries_1.KeysRdfDereferenceConstantHylar.rdfs,
                    sources: [
                        'https://www.w3.org/People/Berners-Lee/card',
                        'http://xmlns.com/foaf/spec/index.rdf',
                    ],
                });
                expect((yield result.toArray()).length).toEqual(9);
            }));
            it('owl2rl on timbl and foaf', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield engine.queryBindings('SELECT * WHERE { <https://www.w3.org/People/Berners-Lee/card#i> a ?o }', {
                    [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
                    [reasoning_context_entries_1.KeysRdfReason.rules.name]: reasoning_context_entries_1.KeysRdfDereferenceConstantHylar.owl2rl,
                    sources: [
                        'https://www.w3.org/People/Berners-Lee/card',
                        'http://xmlns.com/foaf/spec/index.rdf',
                    ],
                });
                expect((yield result.toArray()).length).toEqual(8);
            }));
        });
    });
});
