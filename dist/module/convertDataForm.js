"use strict";
// src/modules/convertDataForm.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateForm = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const convertDateForm = (date) => {
    const now = (0, dayjs_1.default)(date).format("YYYY.MM.DD");
    return now;
};
exports.convertDateForm = convertDateForm;
//# sourceMappingURL=convertDataForm.js.map