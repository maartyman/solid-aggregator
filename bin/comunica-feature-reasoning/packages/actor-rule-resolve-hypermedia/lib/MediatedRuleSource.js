"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediatedRuleSource = void 0;
const asynciterator_1 = require("asynciterator");
/**
 * A lazy rule source
 */
class MediatedRuleSource {
    constructor(context, url, mediators) {
        this.context = context;
        this.url = url;
        this.mediators = mediators;
    }
    get() {
        if (this.cache) {
            return (0, asynciterator_1.fromArray)(this.cache);
        }
        const _data = (0, asynciterator_1.wrap)(this.mediators.mediatorDereferenceRule.mediate({
            url: this.url,
            context: this.context,
        }).then(({ data }) => data));
        this.cache = [];
        return _data.map(rule => {
            var _a;
            (_a = this.cache) === null || _a === void 0 ? void 0 : _a.push(rule);
            return rule;
        });
    }
}
exports.MediatedRuleSource = MediatedRuleSource;
