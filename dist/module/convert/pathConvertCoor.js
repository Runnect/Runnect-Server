"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathConvertCoor = void 0;
const pathConvertCoor = (path) => {
    const leftCoor = path.replace(/\(/gi, "[");
    const rightCoor = leftCoor
        .replace(/\)/gi, "]")
        .substring(1, leftCoor.length - 1); // "[1,2],[3,4],[5,6]"
    const coor = eval("[" + rightCoor + "]");
    return coor;
};
exports.pathConvertCoor = pathConvertCoor;
// "((1,2),(3,4),(5,6))"
// "[1,2],[3,4],[5,6]"
// [[1,2],[3,4],[5,6]]
//# sourceMappingURL=pathConvertCoor.js.map