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
exports.CliArgsHandlerReasoning = void 0;
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
/**
 * Adds and handles CLI options for Solid authentication.
 */
class CliArgsHandlerReasoning {
    populateYargs(argumentsBuilder) {
        return argumentsBuilder
            .options({
            rules: {
                alias: 'r',
                type: 'string',
                describe: `The rules to reason with; select ${Object.keys(reasoning_context_entries_1.KeysRdfDereferenceConstantHylar).join(', ')} or provide a deferencerable URL`,
                default: 'rdfs',
                group: 'Required options:',
            },
        });
    }
    handleArgs(args, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.rules && typeof args.rules === 'string') {
                for (const [key, value] of Object.entries(reasoning_context_entries_1.KeysRdfDereferenceConstantHylar)) {
                    if (key === args.rules.toLowerCase()) {
                        context[reasoning_context_entries_1.KeysRdfReason.rules.name] = value;
                        return;
                    }
                }
            }
            context[reasoning_context_entries_1.KeysRdfReason.rules.name] = args.rules;
        });
    }
}
exports.CliArgsHandlerReasoning = CliArgsHandlerReasoning;
