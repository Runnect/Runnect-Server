"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fail = exports.success = void 0;
// constants/response.ts
const success = (status, message, data) => {
    return {
        status,
        success: true,
        message,
        data,
    };
};
exports.success = success;
const fail = (status, message) => {
    return {
        status,
        success: false,
        message,
    };
};
exports.fail = fail;
//# sourceMappingURL=response.js.map