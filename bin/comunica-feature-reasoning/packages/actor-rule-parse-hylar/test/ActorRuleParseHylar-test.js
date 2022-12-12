"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const core_1 = require("@comunica/core");
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
require("jest-rdf");
const n3_1 = require("n3");
const lib_1 = require("../lib");
const streamifyString = require('streamify-string');
const { variable, quad, namedNode } = n3_1.DataFactory;
function createAction(file, isFile = true) {
    return {
        data: isFile ? fs.createReadStream(path.join(__dirname, 'data', `${file}.hylar`)) : streamifyString(file),
        metadata: { baseIRI: 'http://example.org' },
        context: new core_1.ActionContext(),
    };
}
function createMediaTypedAction(file, isFile = true) {
    return {
        handle: createAction(file, isFile),
        context: new core_1.ActionContext(),
        handleMediaType: 'text/hylar',
    };
}
describe('ActorRuleParseHyLAR', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('An ActorRuleParseHyLAR instance', () => {
        let actor;
        beforeEach(() => {
            actor = new lib_1.ActorRuleParseHylar({ name: 'actor', bus, mediaTypePriorities: { 'text/hylar': 1 } });
        });
        it('should test', () => __awaiter(void 0, void 0, void 0, function* () {
            expect(yield actor.test(createMediaTypedAction('rdfs'))).toEqual({ handle: true });
        }));
        it('Should parse all owl2rl rules', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = yield actor.runHandle(createAction('owl2rl'), 'hylar', new core_1.ActionContext({}));
            expect(yield (0, arrayify_stream_1.default)(data)).toHaveLength(52);
        }));
        it('should run', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = yield actor.runHandle({
                data: streamifyString('(?uuu ?aaa ?yyy) -> (?aaa rdf:type rdf:Property)'),
                context: new core_1.ActionContext(),
            }, 'hylar', new core_1.ActionContext());
            const rules = yield (0, arrayify_stream_1.default)(data);
            expect(rules).toHaveLength(1);
            expect(rules[0].ruleType).toEqual('rdfs');
            expect(rules[0].premise).toBeRdfIsomorphic([
                quad(variable('uuu'), variable('aaa'), variable('yyy'), new n3_1.DefaultGraph()),
            ]);
            expect(rules[0].conclusion).toBeRdfIsomorphic([
                quad(variable('aaa'), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#Property'), new n3_1.DefaultGraph()),
            ]);
        }));
    });
});
