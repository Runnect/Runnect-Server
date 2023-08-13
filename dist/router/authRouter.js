"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const constant_1 = require("../constant");
const controller_1 = require("../controller");
const authRouter = (0, express_1.Router)();
authRouter.post("/", [
    (0, express_validator_1.body)("token")
        .notEmpty()
        .withMessage("토큰이 없습니다."),
    (0, express_validator_1.body)("provider")
        .notEmpty()
        .withMessage("provider 정보가 없습니다."),
], controller_1.authController.getSocialLoginInfo);
authRouter.get("/getNewToken", [
    //원래 auth 미들웨어에서 토큰들의 유무를 검사하나, 재발급시는 auth 미들웨어를 사용하지 않기에 express validator를 사용해 값의 유무 검사
    (0, express_validator_1.header)("refreshToken")
        .notEmpty()
        .withMessage(`refresh ${constant_1.rm.EMPTY_TOKEN}`),
    (0, express_validator_1.header)("accessToken")
        .notEmpty()
        .withMessage(`access ${constant_1.rm.EMPTY_TOKEN}`),
], controller_1.authController.getNewToken);
exports.default = authRouter;
//# sourceMappingURL=authRouter.js.map