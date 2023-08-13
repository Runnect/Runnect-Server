"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomInitialNickname = void 0;
const randomInitialNickname = () => {
    return `임시${Math.random().toString(36).substring(2, 11)}`;
};
exports.randomInitialNickname = randomInitialNickname;
//# sourceMappingURL=randomInitialNickname.js.map