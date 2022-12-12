"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHeaders = void 0;
function setHeaders(logger, res, queryExecutor) {
    if (!queryExecutor) {
        res.statusCode = 404;
        res.write("");
        res.end();
        return false;
    }
    if (!queryExecutor.isInitializationFinished()) {
        /* add 425 response header */
        logger.debug(`Header status code: 425`);
        res.statusCode = 425;
        res.write("");
        res.end();
        return false;
    }
    if (!queryExecutor.isQueryFinished()) {
        /* add 206 response header */
        logger.debug(`Header status code: 206`);
        res.statusCode = 206;
        res.setHeader("ETag", "");
        return true;
    }
    /* add 200 response header */
    logger.debug(`Header status code: 200`);
    res.statusCode = 200;
    res.setHeader("ETag", "");
    return true;
}
exports.setHeaders = setHeaders;
