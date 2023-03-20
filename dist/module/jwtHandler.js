"use strict";
// src/modules/jwtHandler.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../constant");
//* 받아온 userId를 담는 access token 생성
const sign = (userId) => {
    const payload = {
        userId,
    };
    //sign 메소드는 첫인자 payload, 두번째 secretkey 세번째 option : 토큰의 유통기한
    const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
    return accessToken;
};
//* refreshToken 발급
const createRefreshToken = () => {
    const refreshToken = jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET, { expiresIn: "14d" });
    return refreshToken;
};
//* token 검사!
const verify = (token) => {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "jwt expired") {
                return constant_1.tokenType.TOKEN_EXPIRED;
            }
            else if (error.message === "invalid token") {
                return constant_1.tokenType.TOKEN_INVALID;
            }
            else {
                return constant_1.tokenType.TOKEN_INVALID;
            }
        }
        else {
            console.log(error);
        }
    }
    return decoded;
};
exports.default = {
    sign,
    verify,
    createRefreshToken,
};
//# sourceMappingURL=jwtHandler.js.map