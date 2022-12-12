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
exports.LocalQueryEngineFactory = void 0;
class LocalQueryEngineFactory {
    static getOrCreate(comunicaVersion, comunicaContext) {
        return __awaiter(this, void 0, void 0, function* () {
            let tempEngine = this.engines.get(comunicaVersion + comunicaContext);
            if (tempEngine != undefined) {
                return tempEngine;
            }
            const queryEngineFactory = require(comunicaVersion).QueryEngineFactory;
            tempEngine = new queryEngineFactory().create({
                configPath: comunicaContext,
            });
            if (tempEngine == undefined) {
                throw new Error("this shouldn't happen");
            }
            this.engines.set(comunicaVersion + comunicaContext, tempEngine);
            return tempEngine;
        });
    }
}
exports.LocalQueryEngineFactory = LocalQueryEngineFactory;
LocalQueryEngineFactory.engines = new Map();
