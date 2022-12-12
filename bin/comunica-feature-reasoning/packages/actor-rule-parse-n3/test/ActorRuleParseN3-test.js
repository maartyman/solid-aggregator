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
const reasoning_mocks_1 = require("@comunica/reasoning-mocks");
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const n3_1 = require("n3");
const lib_1 = require("../lib");
require("jest-rdf");
const streamifyString = require('streamify-string');
const { namedNode, quad, variable } = n3_1.DataFactory;
const rule1 = `
@prefix : <dpe#>.

{:b :re ?X} => {:c :not_re ?X}.
`;
const rule1Equivalent = `
@prefix : <dpe#>.

{:c :not_re ?X} <= {:b :re ?X}.
`;
const rule2 = `
@prefix list: <http://www.w3.org/2000/10/swap/list#>.
@prefix e: <http://eulersharp.sourceforge.net/2003/03swap/log-rules#>.
@prefix : <http://josd.github.io/brain/4color#>.

{() :places true} <= true.

{?PLACES :places true} <= {
    ?PLACES e:firstRest ((?PLACE ?COLOR) ?TAIL).
    ?TAIL :places true.
    ?PLACE :neighbours ?NEIGHBOURS.
    (:red :green :blue :yellow) list:member ?COLOR.
    ?SCOPE e:fail {
        ?TAIL list:member (?NEIGHBOUR ?COLOR).
        ?NEIGHBOURS list:member ?NEIGHBOUR.
    }.
}.
`;
function createAction(file, isFile = true) {
    return {
        data: isFile ? fs.createReadStream(path.join(__dirname, 'data', `${file}.hylar`)) : streamifyString(file),
        metadata: { baseIRI: 'http://example.org#' },
        context: new core_1.ActionContext(),
    };
}
function createMediaTypedAction(file, isFile = true) {
    return {
        handle: createAction(file, isFile),
        context: new core_1.ActionContext(),
    };
}
describe('ActorRuleParseN3', () => {
    let bus;
    beforeEach(() => {
        bus = new core_1.Bus({ name: 'bus' });
    });
    describe('An ActorRuleParseN3 instance', () => {
        let actor;
        beforeEach(() => {
            actor = new lib_1.ActorRuleParseN3({
                name: 'actor',
                bus,
                mediatorRdfParse: reasoning_mocks_1.mediatorRdfParse,
                mediaTypeFormats: {},
                mediaTypePriorities: {},
            });
        });
        // TODO: IMPLEMENT THIS
        // it('should test', async() => {
        //   await expect(actor.test(createMediaTypedAction(rule1, false))).resolves.toEqual({ handle: []});
        //   await expect(actor.test(createMediaTypedAction(rule2, false))).resolves.toEqual({ handle: []});
        // });
        it('should run', () => __awaiter(void 0, void 0, void 0, function* () {
            const { data } = (yield actor.run(createMediaTypedAction(rule1, false))).handle;
            const arr = yield (0, arrayify_stream_1.default)(data);
            expect(arr).toHaveLength(1);
            const rule = arr[0];
            expect(rule.premise).toEqualRdfQuadArray([
                quad(namedNode('http://dpe#b'), namedNode('http://dpe#re'), variable('X'), variable('g')),
            ]);
            expect(rule.conclusion).toEqualRdfQuadArray([
                quad(namedNode('http://dpe#c'), namedNode('http://dpe#not_re'), variable('X'), variable('g')),
            ]);
        }));
    });
});
