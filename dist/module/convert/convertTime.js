"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringConvertTime = exports.dateConvertString = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const dateConvertString = (date) => {
    const timestampString = (0, dayjs_1.default)(date).format("YYYY-MM-DD HH:mm:ss.SSS");
    return timestampString;
}; //DB에서 저장되고 출력되는 DATE 타입의 객체를 response로 보내줄때 string 으로 변경
exports.dateConvertString = dateConvertString;
const stringConvertTime = (string) => {
    var time = new Date();
    var [hours, minutes, seconds] = string.split(":");
    time.setHours(+hours);
    time.setMinutes(+minutes);
    time.setSeconds(+seconds);
    return time;
}; //request의 string 형태의 시간정보를 DB에 저장할수있도록 DATE 타입으로 변경
exports.stringConvertTime = stringConvertTime;
//# sourceMappingURL=convertTime.js.map