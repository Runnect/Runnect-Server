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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const google = (idToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = yield client.verifyIdToken({
            idToken: idToken,
            audience: [(_a = process.env.GOOGLE_CLIENT_ID) !== null && _a !== void 0 ? _a : "", (_b = process.env.GOOGLE_CLIENT_ID_2) !== null && _b !== void 0 ? _b : ""],
        }); // ' A ?? B : A가 null 또는 undefined일 경우 B를 반환한다
        const payload = ticket.getPayload();
        if (payload) {
            return { socialId: payload["sub"], email: payload["email"], provider: "GOOGLE" };
        }
        return null;
    }
    catch (error) {
        console.log(error);
        if ((error === null || error === void 0 ? void 0 : error.toString().indexOf('Token used too late')) != -1)
            return `만료된 소셜 토큰 입니다.`;
    }
});
const apple = (appleToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appleUser = jsonwebtoken_1.default.decode(appleToken);
        console.log(appleUser);
        if (appleUser || appleUser.email_verified == "true") {
            return { socialId: appleUser["sub"], email: appleUser["email"], provider: "APPLE" };
        }
        //appleUser가 Null인경우 : 토큰자체에러
        //appleUser.email_verified가 false : 이메일이 확인되지 ㅏㅇㄴㅎ았다
        return null;
    }
    catch (error) {
        console.log(error);
    }
});
const kakao = (kakaoAccessToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, axios_1.default)({
            method: "get",
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
                Authorization: `Bearer ${kakaoAccessToken}`,
            },
        });
        return { socialId: user.data.id.toString(), email: user.data.kakao_account.email, provider: "KAKAO" };
    }
    catch (error) {
        console.log(error);
    }
});
const social = {
    google,
    apple,
    kakao,
};
exports.default = social;
//# sourceMappingURL=social.js.map