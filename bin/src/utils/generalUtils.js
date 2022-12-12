"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayEquality = exports.resolveUndefined = exports.resolveUndefinedString = void 0;
function resolveUndefinedString(string) {
    return string ? string : "";
}
exports.resolveUndefinedString = resolveUndefinedString;
function resolveUndefined(val, defaultValue) {
    if (val == undefined) {
        if (defaultValue == undefined) {
            throw new Error('value undefined');
        }
        else {
            return defaultValue;
        }
    }
    return val;
}
exports.resolveUndefined = resolveUndefined;
function arrayEquality(array1, array2) {
    for (const element1 of array1) {
        let equal = false;
        for (const element2 of array2) {
            if (element1 === element2) {
                equal = true;
                break;
            }
        }
        if (!equal) {
            return false;
        }
    }
    for (const element2 of array2) {
        let equal = false;
        for (const element1 of array1) {
            if (element1 === element2) {
                equal = true;
                break;
            }
        }
        if (!equal) {
            return false;
        }
    }
    return true;
}
exports.arrayEquality = arrayEquality;
