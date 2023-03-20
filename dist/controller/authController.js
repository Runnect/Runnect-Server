"use strict";
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
const express_validator_1 = require("express-validator");
const response_1 = require("./../constant/response");
const constant_1 = require("../constant");
const social_1 = __importDefault(require("../module/social"));
const service_1 = require("../service");
const jwtHandler_1 = __importDefault(require("../module/jwtHandler"));
const getSocialLoginInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const { token, provider } = req.body;
    let socialUser = null;
    try {
        switch (provider) {
            case "GOOGLE":
                socialUser = yield social_1.default.google(token);
                break;
        }
        if (typeof socialUser === "undefined" || socialUser === null) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.READ_SOCIAL_FAIL));
        }
        const existingUser = yield service_1.userService.getUserByEmail(socialUser);
        const refreshToken = jwtHandler_1.default.createRefreshToken();
        // 기존 유저
        if (existingUser) {
            const updatedUser = yield service_1.authService.updateRefreshToken(existingUser.id, refreshToken);
            if (!updatedUser)
                return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.READ_USER_FAIL));
            const accessToken = jwtHandler_1.default.sign(updatedUser.id);
            const existingUserResponseDTO = {
                type: "Login",
                email: updatedUser.email,
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.LOGIN_SUCCESS, existingUserResponseDTO));
        }
        // 새로운 유저
        const newUser = yield service_1.userService.createUser(socialUser, refreshToken);
        if (!newUser) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.READ_USER_FAIL));
        }
        else if (typeof newUser === "string" || newUser instanceof String) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, newUser));
        }
        else {
            const accessToken = jwtHandler_1.default.sign(newUser.id);
            const newUserResponseDTO = {
                type: "Signup",
                email: newUser.email,
                nickname: newUser.nickname,
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.SIGNUP_SUCCESS, newUserResponseDTO));
        }
    }
    catch (error) {
        console.log(error);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const getNewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //토큰들이 없는지 확인 :  이미 express-validator사용
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    //헤더에 저장된 accessToken과 refreshToken 받아오기
    const accessToken = req.header("accessToken");
    const refreshToken = req.header("refreshToken");
    //일단 토큰이 존재는 함
    try {
        const decodedAccessToken = jwtHandler_1.default.verify(accessToken); //? jwtHandler에서 만들어둔 verify로 토큰 검사
        const decodedRefreshToken = jwtHandler_1.default.verify(refreshToken); //? jwtHandler에서 만들어둔 verify로 토큰 검사
        //? 토큰 에러 분기 처리(reissueToken)
        //? 1. accessToken 이상 -> 재로그인
        //? 2.1 accessToken(정상또는 만료) +refreshToken (이상 또는 만료) -> 재로그인
        //? 2.2 accessToken(정상또는 만료) +refreshToken 정상 -> 토큰 재발급
        if (decodedAccessToken === constant_1.tokenType.TOKEN_INVALID || decodedRefreshToken === constant_1.tokenType.TOKEN_INVALID)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.INVALID_TOKEN));
        if (decodedRefreshToken === constant_1.tokenType.TOKEN_EXPIRED)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.EXPIRED_ALL_TOKEN));
        // 토큰 재발급
        const user = yield service_1.userService.getUserByRefreshToken(refreshToken);
        //refreshtoken으로 유저를 찾을 수 없을때
        if (!user)
            return res.status(constant_1.sc.UNAUTHORIZED).send((0, response_1.fail)(constant_1.sc.UNAUTHORIZED, constant_1.rm.NO_USER));
        const newAccessToken = jwtHandler_1.default.sign(user.id);
        const newTokenGetResponseDTO = {
            accessToken: newAccessToken,
            refreshToken: refreshToken,
        };
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.CREATE_TOKEN_SUCCESS, newTokenGetResponseDTO));
    }
    catch (error) {
        console.log(error);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const authController = {
    getSocialLoginInfo,
    getNewToken,
};
exports.default = authController;
//# sourceMappingURL=authController.js.map