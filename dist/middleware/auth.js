"use strict";
// src/middleware/auth.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../constant");
const response_1 = require("../constant/response");
const tokenType_1 = __importDefault(require("../constant/tokenType"));
const jwtHandler_1 = __importDefault(require("../module/jwtHandler"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //아마 ? 예약어는 ts 인터페이스 문법에서와 같이 authorization 속성이 있는 경우를 뜻하는듯
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ").reverse()[0]; //? Bearer ~~ 에서 토큰만 파싱
    //왜 split :배어러 토큰을 토큰 배어러로 순서를 바꾸기 위해
    //토큰이 없으면 인증된 사람이 아니다
    if (!token)
        return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.EMPTY_TOKEN));
    try {
        const decoded = jwtHandler_1.default.verify(token); //? jwtHandler에서 만들어둔 verify로 토큰 검사
        //? 토큰 에러 분기 처리
        if (decoded === tokenType_1.default.TOKEN_EXPIRED)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.EXPIRED_TOKEN));
        if (decoded === tokenType_1.default.TOKEN_INVALID)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.INVALID_TOKEN));
        //? decode한 후 담겨있는 userId를 꺼내옴
        const userId = decoded.userId;
        if (!userId)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.INVALID_TOKEN));
        //? 얻어낸 userId 를 Request Body 내 userId 필드에 담고, 다음 미들웨어로 넘김( next() )
        req.body.userId = userId;
        //req.body의 필드를 지금 하나 생성하는 것
        next();
    }
    catch (error) {
        console.log(error);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
//# sourceMappingURL=auth.js.map