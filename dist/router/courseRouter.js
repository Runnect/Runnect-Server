"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import { Router } from "express";
const express_1 = require("express");
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.post("/", middleware_1.upload.single("image"), 
/*(req: Request, res: Response, next: NextFunction) => {
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~s3 multer 업로드후 req 시작~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  console.log(req.body);
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~s3 multer 업로드후 req 끝~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  next();
},*/
middleware_1.multiformDataConvert, middleware_1.auth, [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
    (0, express_validator_1.body)("path")
        .notEmpty()
        .withMessage("경로가 없습니다."),
    (0, express_validator_1.body)("distance")
        .notEmpty()
        .withMessage("거리 정보가 없습니다.")
        .isNumeric()
        .withMessage("거리 정보가 숫자가 아닙니다."),
    (0, express_validator_1.body)("departureAddress")
        .notEmpty()
        .withMessage("출발지 정보가 없습니다."),
], controller_1.courseController.createCourse);
router.put("/", [
    (0, express_validator_1.body)("courseIdList")
        .notEmpty()
        .withMessage("코스 아이디가 없습니다.")
        .isArray()
        .withMessage("코스 아이디 들이 리스트 형식이 아닙니다"),
    (0, express_validator_1.body)("courseIdList.*")
        .isNumeric()
        .withMessage("코스 아이디들이 숫자가 아닙니다."),
], controller_1.courseController.deleteCourse);
router.get("/user", middleware_1.auth, [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
], controller_1.courseController.getCourseByUser);
router.get("/private/user", middleware_1.auth, [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
], controller_1.courseController.getPrivateCourseByUser);
router.get("/detail/:courseId", middleware_1.auth, [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
    (0, express_validator_1.param)("courseId")
        .notEmpty()
        .withMessage("코스 아이디가 없습니다.")
        .isNumeric()
        .withMessage("코스 아이디가 숫자가 아닙니다."),
], controller_1.courseController.getCourseDetail);
exports.default = router;
//# sourceMappingURL=courseRouter.js.map