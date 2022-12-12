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
exports.QueryExecutor = void 0;
const tslog_1 = require("tslog");
const loggerSettings_1 = require("../utils/loggerSettings");
const reasoning_context_entries_1 = require("@comunica/reasoning-context-entries");
const n3_1 = require("n3");
const queryExecutorFactory_1 = require("./queryExecutorFactory");
const actor_1 = require("../utils/actor-factory/actor");
const guardPolling_1 = require("../guard/guardPolling");
const localQueryEngineFactory_1 = require("../queryEngineFactory/localQueryEngineFactory");
class QueryExecutor extends actor_1.Actor {
    constructor(UUID, queryExplanation) {
        super(UUID);
        this.logger = new tslog_1.Logger(loggerSettings_1.loggerSettings);
        this.results = new Map();
        this.queryEngineBuild = false;
        this.queryFinished = false;
        this.initializationFinished = false;
        this.changedResources = new Array();
        this.guards = new Map;
        this.queryExplanation = queryExplanation;
        this.logger.debug("comunicaVersion = " + queryExplanation.comunicaVersion.toString());
        this.logger.debug("comunica context path = " + queryExplanation.comunicaContext.toString());
        localQueryEngineFactory_1.LocalQueryEngineFactory.getOrCreate(queryExplanation.comunicaVersion.toString(), queryExplanation.comunicaContext.toString()).then((queryEngine) => {
            this.queryEngine = queryEngine;
            this.logger.debug(`Comunica engine build`);
            this.queryEngineBuild = true;
            this.emit("queryEngineEvent", "build");
            this.executeQuery();
        });
    }
    executeQuery() {
        return __awaiter(this, void 0, void 0, function* () {
            this.queryFinished = false;
            this.guards.forEach((value) => {
                value.used = false;
            });
            this.results.forEach((value) => {
                value.used = false;
            });
            this.logger.debug(`Starting comunica query, with query: \n${this.queryExplanation.queryString.toString()}`);
            if (this.queryEngine == undefined) {
                throw new TypeError("queryEngine is undefined");
            }
            this.logger.debug(`Starting comunica query, with reasoningRules: \n${this.queryExplanation.reasoningRules.toString()}`);
            /*
            TODO temporarily turning this off as it doesn't work => query explanation will give the used resources (I think)
            let parallelPromise = new Array<Promise<any>>();
            for (const resource of this.changedResources) {
              parallelPromise.push(this.queryEngine.invalidateHttpCache(resource));
            }
            await Promise.all(parallelPromise);
        
             */
            yield this.queryEngine.invalidateHttpCache();
            this.changedResources.splice(0);
            const bindingsStream = yield this.queryEngine.queryBindings(this.queryExplanation.queryString.toString(), {
                sources: this.queryExplanation.sources,
                [reasoning_context_entries_1.KeysRdfReason.implicitDatasetFactory.name]: () => new n3_1.Store(),
                [reasoning_context_entries_1.KeysRdfReason.rules.name]: this.queryExplanation.reasoningRules.toString(),
                fetch: this.customFetch.bind(this),
                lenient: this.queryExplanation.lenient
            });
            bindingsStream.on('data', (binding) => {
                //TODO handle delete not only additions
                this.logger.debug(`on data: ${binding.toString()}`);
                const result = this.results.get(binding.toString());
                if (!result) {
                    this.results.set(binding.toString(), { bindings: binding, used: true });
                    this.emit("binding", [binding], true);
                }
                else {
                    result.used = true;
                }
            });
            bindingsStream.on('end', () => {
                this.afterQueryCleanup();
            });
            bindingsStream.on('error', (error) => {
                //TODO solve error
                this.logger.error(error);
                this.emit("queryEvent", "error");
            });
        });
    }
    customFetch(input, init) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO check used resources: delete the ones that aren't used add the new ones
            //TODO possibly wait until the resource is actively guarded
            const originalInput = input.toString();
            input = new URL(input.toString());
            input = input.origin + input.pathname;
            let guardObject = this.guards.get(input);
            if (!guardObject) {
                guardObject = { guard: yield guardPolling_1.GuardPolling.factory.getOrCreate(input), used: true };
                if (!guardObject) {
                    throw new Error("guard couldn't be instantiated;");
                }
                guardObject.guard.on("ResourceChanged", this.resourceChanged.bind(this, originalInput));
            }
            if (!guardObject.guard.isGuardActive(input)) {
                yield guardActive(guardObject.guard, input);
            }
            this.guards.set(input, guardObject);
            return fetch(input, init);
        });
    }
    getData() {
        const bindings = [];
        this.results.forEach((value) => {
            if (value.used) {
                bindings.push(value.bindings);
            }
        });
        return bindings;
    }
    isQueryEngineBuild() {
        return this.queryEngineBuild;
    }
    isQueryFinished() {
        return this.queryFinished;
    }
    isInitializationFinished() {
        return this.initializationFinished;
    }
    resourceChanged(resource, input) {
        this.logger.debug("data has changed with resource: " + resource + " and input: " + input);
        const inputURL = new URL(input);
        if (inputURL.origin + inputURL.pathname === resource) {
            this.changedResources.push(input);
            this.logger.debug("resource added to array: " + this.changedResources[0]);
            if (this.queryFinished) {
                this.executeQuery();
            }
        }
    }
    afterQueryCleanup() {
        if (!this.initializationFinished) {
            this.emit("queryEvent", "initialized");
            this.initializationFinished = true;
        }
        this.guards.forEach((value, key) => {
            this.logger.debug("Resource: " + key + " is used: " + value.used);
            if (!value.used) {
                value.guard.removeListener("ResourceChanged", this.resourceChanged);
                if (value.guard.listenerCount("ResourceChanged") == 0) {
                    value.guard.delete();
                }
                this.guards.delete(key);
            }
        });
        this.results.forEach((value, key) => {
            if (!value.used) {
                this.emit("binding", [value.bindings], false);
                this.results.delete(key);
            }
        });
        printMap(this.results);
        this.queryFinished = true;
        this.logger.debug(`Comunica query finished`);
        this.emit("queryEvent", "done");
        if (this.changedResources.length > 0) {
            this.executeQuery();
        }
    }
}
exports.QueryExecutor = QueryExecutor;
QueryExecutor.factory = new queryExecutorFactory_1.QueryExecutorFactory();
function guardActive(guard, input) {
    return __awaiter(this, void 0, void 0, function* () {
        guard.on("guardActive", (resource, value) => {
            if (resource === input && value) {
                return;
            }
        });
    });
}
function printMap(map) {
    let text = "Map content: \n";
    map.forEach((value, key) => {
        text += "bindings: \n";
        value.bindings.forEach((value, key) => {
            text += "\t" + key.value + ": " + value.value + "\n";
        });
    });
    new tslog_1.Logger(loggerSettings_1.loggerSettings).debug(text);
}
