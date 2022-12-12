"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockHttp = void 0;
const path_1 = require("path");
const core_1 = require("@pollyjs/core");
const setup_polly_jest_1 = require("setup-polly-jest");
const NodeHttpAdapter = require('@pollyjs/adapter-node-http');
const FSPersister = require('@pollyjs/persister-fs');
const recordingsDir = (0, path_1.resolve)(__dirname, './assets/http');
core_1.Polly.register(FSPersister);
core_1.Polly.register(NodeHttpAdapter);
// Mocks HTTP requests using Polly.JS
function mockHttp() {
    return (0, setup_polly_jest_1.setupPolly)({
        adapters: [NodeHttpAdapter],
        persister: FSPersister,
        persisterOptions: { fs: { recordingsDir } },
        recordFailedRequests: true,
        matchRequestsBy: {
            headers: {
                exclude: ['user-agent'],
            },
        },
    });
}
exports.mockHttp = mockHttp;
