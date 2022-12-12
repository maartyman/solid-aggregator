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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const bus_dereference_1 = require("@comunica/bus-dereference");
const context_entries_1 = require("@comunica/context-entries");
const core_1 = require("@comunica/core");
const logger_void_1 = require("@comunica/logger-void");
const arrayify_stream_1 = __importDefault(require("arrayify-stream"));
const lib_1 = require("../lib");
describe('ActorDereferenceRuleParse', () => {
    let context;
    let actor;
    beforeEach(() => {
        actor = new lib_1.ActorDereferenceRuleParse({
            bus: new core_1.Bus({ name: 'bus' }),
            // @ts-expect-error
            mediatorDereference: {
                mediate: jest.fn((action) => __awaiter(void 0, void 0, void 0, function* () {
                    const ext = action.context.hasRaw('extension') ?
                        action.context.getRaw('extension') :
                        'index.html';
                    return {
                        data: (0, bus_dereference_1.emptyReadable)(),
                        url: `${action.url}${ext}`,
                        requestTime: 0,
                        exists: true,
                    };
                })),
            },
            // @ts-expect-error
            mediatorParse: {
                mediate: jest.fn((action) => __awaiter(void 0, void 0, void 0, function* () {
                    const data = new stream_1.Readable();
                    if (action.context.hasRaw('emitParseError')) {
                        data._read = () => {
                            data.emit('error', new Error('Parse error'));
                        };
                        return { handle: { data, metadata: { triples: true } } };
                    }
                    if (action.context.hasRaw('parseReject')) {
                        return Promise.reject(new Error('Parse reject error'));
                    }
                    data._read = () => {
                        action.handle.data.read(1);
                        data.push(null);
                    };
                    action.handle.data.on('error', (error) => data.emit('error', error));
                    return { handle: { data, metadata: { triples: true } } };
                })),
            },
            // @ts-expect-error
            mediatorParseMediatypes: {
                mediate(action) {
                    return __awaiter(this, void 0, void 0, function* () {
                        return {
                            mediaTypes: {},
                        };
                    });
                },
            },
            mediaMappings: {
                x: 'y',
            },
            name: 'actor',
        });
    });
    it('Should resolve media mappings correctly (unknown extension)', () => __awaiter(void 0, void 0, void 0, function* () {
        context = new core_1.ActionContext({});
        const output = yield actor.run({ url: 'https://www.google.com/', context });
        expect(output.url).toEqual('https://www.google.com/index.html');
        expect(actor.mediatorParse.mediate).toHaveBeenCalledWith({
            context,
            handle: expect.anything(),
            handleMediaType: undefined,
        });
    }));
    it('Should resolve media mappings correctly (unknown extension - given mediaType)', () => __awaiter(void 0, void 0, void 0, function* () {
        context = new core_1.ActionContext({});
        const output = yield actor.run({ url: 'https://www.google.com/', context, mediaType: 'rdf' });
        expect(output.url).toEqual('https://www.google.com/index.html');
        expect(actor.mediatorParse.mediate).toHaveBeenCalledWith({
            context,
            handle: expect.anything(),
            handleMediaType: 'rdf',
        });
    }));
    it('Should resolve media mappings correctly (known extension)', () => __awaiter(void 0, void 0, void 0, function* () {
        context = new core_1.ActionContext({ extension: 'other.x' });
        const output = yield actor.run({ url: 'https://www.google.com/', context });
        expect(output.url).toEqual('https://www.google.com/other.x');
        expect(actor.mediatorParse.mediate).toHaveBeenCalledWith({
            context,
            handle: expect.anything(),
            handleMediaType: 'y',
        });
    }));
    it('should run and receive parse errors', () => __awaiter(void 0, void 0, void 0, function* () {
        context = new core_1.ActionContext({ emitParseError: true });
        const output = yield actor.run({ url: 'https://www.google.com/', context });
        expect(output.url).toEqual('https://www.google.com/index.html');
        yield expect((0, arrayify_stream_1.default)(output.data)).rejects.toThrow(new Error('Parse error'));
    }));
    it('should run and ignore parse errors in lenient mode', () => __awaiter(void 0, void 0, void 0, function* () {
        context = new core_1.ActionContext({ emitParseError: true, [context_entries_1.KeysInitQuery.lenient.name]: true });
        const spy = jest.spyOn(actor, 'logError');
        const output = yield actor.run({ url: 'https://www.google.com/', context });
        expect(output.url).toEqual('https://www.google.com/index.html');
        expect(yield (0, arrayify_stream_1.default)(output.data)).toEqual([]);
        expect(spy).toHaveBeenCalledTimes(1);
    }));
    it('should run and ignore parse errors in lenient mode and log them', () => __awaiter(void 0, void 0, void 0, function* () {
        const logger = new logger_void_1.LoggerVoid();
        const spy = jest.spyOn(logger, 'error');
        context = new core_1.ActionContext({
            emitParseError: true,
            [context_entries_1.KeysInitQuery.lenient.name]: true,
            [context_entries_1.KeysCore.log.name]: logger,
        });
        const output = yield actor.run({ url: 'https://www.google.com/', context });
        expect(yield (0, arrayify_stream_1.default)(output.data)).toEqual([]);
        expect(spy).toHaveBeenCalledWith('Parse error', {
            actor: 'actor',
            url: 'https://www.google.com/',
        });
    }));
    it('should not run on parse rejects', () => {
        context = new core_1.ActionContext({ parseReject: true });
        return expect(actor.run({ url: 'https://www.google.com/', context }))
            .rejects.toThrow(new Error('Parse reject error'));
    });
    it('should run and ignore parse rejects in lenient mode', () => __awaiter(void 0, void 0, void 0, function* () {
        context = new core_1.ActionContext({ parseReject: true, [context_entries_1.KeysInitQuery.lenient.name]: true });
        const spy = jest.spyOn(actor, 'logError');
        const output = yield actor.run({ url: 'https://www.google.com/', context });
        expect(output.url).toEqual('https://www.google.com/index.html');
        expect(yield (0, arrayify_stream_1.default)(output.data)).toEqual([]);
        expect(spy).toHaveBeenCalledTimes(1);
    }));
    it('should run and ignore parse rejects in lenient mode and log them', () => __awaiter(void 0, void 0, void 0, function* () {
        const logger = new logger_void_1.LoggerVoid();
        const spy = jest.spyOn(logger, 'error');
        context = new core_1.ActionContext({
            parseReject: true,
            [context_entries_1.KeysInitQuery.lenient.name]: true,
            [context_entries_1.KeysCore.log.name]: logger,
        });
        yield actor.run({ url: 'https://www.google.com/', context });
        expect(spy).toHaveBeenCalledWith('Parse reject error', {
            actor: 'actor',
        });
    }));
});
