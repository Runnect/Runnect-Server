"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = require("../controller");
const scrapRouter = (0, express_1.Router)();
scrapRouter.post("/", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
    (0, express_validator_1.body)("publicCourseId")
        .notEmpty()
        .withMessage("퍼블릭 코스 아이디가 없음")
        .isNumeric()
        .withMessage("유효하지 않은 퍼블릭 코스 아이디"),
    (0, express_validator_1.body)("scrapTF")
        .notEmpty()
        .withMessage("스크랩 여부가 없음.")
        .isBoolean()
        .withMessage(" 스크랩 여부가 True or False 값이 아님"),
], controller_1.scrapController.createAndDeleteScrap);
scrapRouter.get("/user", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
], controller_1.scrapController.getScrapCourseByUSer);
exports.default = scrapRouter;
//# sourceMappingURL=scrapRouter.js.map