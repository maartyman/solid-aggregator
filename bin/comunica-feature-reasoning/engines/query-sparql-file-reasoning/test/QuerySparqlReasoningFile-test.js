"use strict";
/** @jest-environment setup-polly-jest/jest-environment-node */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path = __importStar(require("path"));
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
                    [reasoning_context_entries_1.KeysRdfReason.rules.name]: path.join(__dirname, './data/empty-rule.hylar'),
                    sources: [new n3_1.Store([
                            DF.quad(DF.namedNode('http://example.org/s'), DF.namedNode('http://example.org/p'), DF.namedNode('http://example.org/o')),
                        ])],
                });
                expect(yield result.toArray()).toHaveLength(1);
            }));
            it('should return a single triple with empty rule serialised in n3', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield engine.queryBindings('SELECT * WHERE { ?s ?p ?o }', {
                    [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
                    [reasoning_context_entries_1.KeysRdfReason.rules.name]: path.join(__dirname, './data/empty-rule.n3'),
                    sources: [new n3_1.Store([
                            DF.quad(DF.namedNode('http://example.org/s'), DF.namedNode('http://example.org/p'), DF.namedNode('http://example.org/o')),
                        ])],
                });
                expect(yield result.toArray()).toHaveLength(1);
            }));
            it('should correctly apply subclasses', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield engine.queryBindings('SELECT * WHERE { <http://example.org/Jesse> a ?o }', {
                    [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
                    [reasoning_context_entries_1.KeysRdfReason.rules.name]: path.join(__dirname, './data/subclass-rule.hylar'),
                    sources: [new n3_1.Store([
                            DF.quad(DF.namedNode('http://example.org/Person'), DF.namedNode('http://www.w3.org/2000/01/rdf-schema#subClassOf'), DF.namedNode('http://example.org/Thing')),
                            DF.quad(DF.namedNode('http://example.org/Jesse'), DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), DF.namedNode('http://example.org/Person')),
                        ])],
                });
                expect(yield result.toArray()).toHaveLength(2);
            }));
            it('should correctly apply subclasses with subclass rule serialised in n3', () => __awaiter(void 0, void 0, void 0, function* () {
                const result = yield engine.queryBindings('SELECT * WHERE { <http://example.org/Jesse> a ?o }', {
                    [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
                    [reasoning_context_entries_1.KeysRdfReason.rules.name]: path.join(__dirname, './data/subclass-rule.n3'),
                    sources: [new n3_1.Store([
                            DF.quad(DF.namedNode('http://example.org/Person'), DF.namedNode('http://www.w3.org/2000/01/rdf-schema#subClassOf'), DF.namedNode('http://example.org/Thing')),
                            DF.quad(DF.namedNode('http://example.org/Jesse'), DF.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), DF.namedNode('http://example.org/Person')),
                        ])],
                });
                expect(yield result.toArray()).toHaveLength(2);
            }));
        });
    });
});
