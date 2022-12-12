#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_entries_1 = require("@comunica/context-entries");
const core_1 = require("@comunica/core");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const runner_cli_1 = require("@comunica/runner-cli");
const n3_1 = require("n3");
const CliArgsHandlerReasoning_1 = require("../lib/CliArgsHandlerReasoning");
const cliArgsHandlerReasoning = new CliArgsHandlerReasoning_1.CliArgsHandlerReasoning();
(0, runner_cli_1.runArgsInProcessStatic)(require('../engine-default.js'), {
    context: new core_1.ActionContext({
        [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
        [context_entries_1.KeysInitQuery.cliArgsHandlers.name]: [cliArgsHandlerReasoning],
    }),
});
