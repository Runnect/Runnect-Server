"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = require("../controller");
const publicCourseRouter = (0, express_1.Router)();
publicCourseRouter.post("/", [
    (0, express_validator_1.body)("courseId")
        .notEmpty()
        .withMessage("코스 아이디가 없습니다.")
        .isNumeric()
        .withMessage("코스 아이디가 숫자가 아닙니다."),
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("제목이 없습니다."),
    (0, express_validator_1.body)("description")
        .notEmpty()
        .withMessage("설명이 없습니다."),
], controller_1.publicCourseController.createPublicCourse);
publicCourseRouter.get("/", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
], controller_1.publicCourseController.recommendPublicCourse);
publicCourseRouter.get("/user", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
], controller_1.publicCourseController.getPublicCourseByUser);
publicCourseRouter.get("/detail/:publicCourseId", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
    (0, express_validator_1.param)("publicCourseId")
        .notEmpty()
        .withMessage("퍼블릭 코스 아이디가 없습니다.")
        .isNumeric()
        .withMessage("퍼블릭 코스 아이디가 숫자가 아닙니다."),
], controller_1.publicCourseController.getPublicCourseDetail);
publicCourseRouter.get("/search", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
    (0, express_validator_1.query)("keyword")
        .notEmpty()
        .withMessage("검색어가 없습니다."),
], controller_1.publicCourseController.searchPublicCourse);
exports.default = publicCourseRouter;
//# sourceMappingURL=publicCourseRouter.js.map