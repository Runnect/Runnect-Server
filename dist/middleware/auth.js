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
const service_1 = require("../service");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //헤더에 저장된 accessToken과 refreshToken 받아오기
    const accessToken = req.header("accessToken");
    const refreshToken = req.header("refreshToken");
    //토큰들이 없는지 확인
    if (!accessToken || !refreshToken)
        return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.EMPTY_TOKEN));
    //일단 토큰이 존재는함
    try {
        const decodedAccessToken = jwtHandler_1.default.verify(accessToken); //? jwtHandler에서 만들어둔 verify로 토큰 검사
        //? 토큰 에러 분기 처리(auth)
        //? 1. accessToken 정상 -> 이 회원이 우리회원이 맞는지 검사(auth)
        //? 2. accessToken 만료 또는 이상 -> 재로그인 또는 토큰 재발급
        //? 토큰 에러 분기 처리(reissueToken)
        //? 1. accessToken 이상 -> 재로그인
        //? 2.1 accessToken(정상또는 만료) +refreshToken (이상 또는 만료) -> 재로그인
        //? 2.2 accessToken(정상또는 만료) +refreshToken 정상 -> 토큰 재발급
        if (decodedAccessToken === tokenType_1.default.TOKEN_EXPIRED)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.EXPIRED_TOKEN));
        if (decodedAccessToken === tokenType_1.default.TOKEN_INVALID)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.INVALID_TOKEN));
        //? decode한 후 담겨있는 userId를 꺼내옴
        const userId = decodedAccessToken.userId;
        if (!userId)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.INVALID_TOKEN));
        //? 얻어낸 userId가 우리 회원인지 검사
        const existingUser = yield service_1.userService.getUserById(userId);
        if (!existingUser)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.NO_USER));
        //? 얻어낸 userId 를 Request Body 내 userId 필드에 담고, 다음 미들웨어로 넘김( next() )
        req.body.userId = existingUser.id;
        //req.body의 필드를 지금 하나 생성하는 것
        next();
    }
    catch (error) {
        console.log(error);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
//# sourceMappingURL=auth.js.map