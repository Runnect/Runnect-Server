"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = require("../controller");
const recordRouter = (0, express_1.Router)();
recordRouter.post("/", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
    (0, express_validator_1.body)("courseId")
        .notEmpty()
        .withMessage("코스 아이디가 없음")
        .isNumeric()
        .withMessage("유효하지 않은 코스 아이디"),
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("경로 타이틀이 없음"),
    (0, express_validator_1.body)("pace")
        .notEmpty()
        .withMessage("경로 뛴 페이스 없음"),
    (0, express_validator_1.body)("time")
        .notEmpty()
        .withMessage("경로 뛴 시간 없음"),
], controller_1.recordController.createRecord);
recordRouter.get("/user", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
], controller_1.recordController.getRecordByUser);
exports.default = recordRouter;
//# sourceMappingURL=recordRouter.js.map