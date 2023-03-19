//import { Router } from "express";
import { Router, Request, Response, NextFunction } from "express";

import { courseController } from "../controller";
import { multiformDataConvert, upload } from "../middleware";
import { header, body, param } from "express-validator";

const router: Router = Router();

router.post(
  "/",
  upload.single("image"),
  multiformDataConvert,
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
    body("path")
      .notEmpty()
      .withMessage("경로가 없습니다."),
    body("distance")
      .notEmpty()
      .withMessage("거리 정보가 없습니다.")
      .isNumeric()
      .withMessage("거리 정보가 숫자가 아닙니다."),
    body("departureAddress")
      .notEmpty()
      .withMessage("출발지 정보가 없습니다."),
  ],
  courseController.createCourse
);

router.get(
  "/user",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
  ],
  courseController.getCourseByUser
);

router.get(
  "/private/user",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
  ],
  courseController.getPrivateCourseByUser
);

router.get(
  "/detail/:courseId",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
    param("courseId")
      .notEmpty()
      .withMessage("코스 아이디가 없습니다.")
      .isNumeric()
      .withMessage("코스 아이디가 숫자가 아닙니다."),
  ],
  courseController.getCourseDetail
);

export default router;
