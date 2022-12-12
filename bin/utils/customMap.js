"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomMap = void 0;
class CustomMap extends Map {
    set(key, value) {
        if (super.has(key)) {
            throw new TypeError("query: \n" + key + " \nalready exists!");
        }
        else {
            super.set(key, value);
        }
        return this;
    }
}
exports.CustomMap = CustomMap;
