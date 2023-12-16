"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = void 0;
const node_http_1 = require("node:http");
class Endpoint {
    httpServer;
    constructor() {
        this.httpServer = (0, node_http_1.createServer)();
    }
    run() {
        this.httpServer.listen(8080);
    }
}
exports.Endpoint = Endpoint;
//# sourceMappingURL=endpoint.js.map