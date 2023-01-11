"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringConvertTime = exports.timestampConvertString = exports.dateConvertString = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const dateConvertString = (date) => {
    const timestampString = (0, dayjs_1.default)(date).format("YYYY-MM-DD HH:mm:ss.SSS");
    return timestampString;
};
exports.dateConvertString = dateConvertString;
const timestampConvertString = (timestamp) => {
    const responseTimestamp = (0, dayjs_1.default)(timestamp).format("YYYY-MM-DD HH:mm:ss.SSS");
    return responseTimestamp;
};
exports.timestampConvertString = timestampConvertString;
const stringConvertTime = (string) => {
    var time = new Date();
    var [hours, minutes, seconds] = string.split(":");
    time.setHours(+hours);
    time.setMinutes(+minutes);
    time.setSeconds(+seconds);
    return time;
};
exports.stringConvertTime = stringConvertTime;
//# sourceMappingURL=convertTime.js.map