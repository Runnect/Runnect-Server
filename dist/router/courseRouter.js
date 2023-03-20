"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { Router } from "express";
const express_1 = require("express");
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post("/", middleware_1.upload.single("image"), middleware_1.multiformDataConvert, [
    (0, express_validator_1.header)("machineId").notEmpty().withMessage("기기넘버가 없습니다"),
    (0, express_validator_1.body)("path").notEmpty().withMessage("경로가 없습니다."),
    (0, express_validator_1.body)("distance").notEmpty().withMessage("거리 정보가 없습니다.").isNumeric().withMessage("거리 정보가 숫자가 아닙니다."),
    (0, express_validator_1.body)("departureAddress").notEmpty().withMessage("출발지 정보가 없습니다."),
], controller_1.courseController.createCourse);
router.get("/user", [(0, express_validator_1.header)("machineId").notEmpty()], controller_1.courseController.getCourseByUser);
router.get("/user", [(0, express_validator_1.header)("machineId").notEmpty()], controller_1.courseController.getCourseByUser);
router.get("/private/user", [(0, express_validator_1.header)("machineId").notEmpty()], controller_1.courseController.getPrivateCourseByUser);
router.get("/detail/:courseId", [
    (0, express_validator_1.header)("machineId").notEmpty().withMessage("기기넘버가 없습니다."),
    (0, express_validator_1.param)("courseId").notEmpty().withMessage("코스 아이디가 없습니다.").isNumeric().withMessage("코스 아이디가 숫자가 아닙니다."),
], controller_1.courseController.getCourseDetail);
exports.default = router;
//# sourceMappingURL=courseRouter.js.map