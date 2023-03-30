import { Router } from "express";
import { body, header, param, query } from "express-validator";
import { publicCourseController } from "../controller";

const publicCourseRouter: Router = Router();

publicCourseRouter.post(
  "/",
  [
    body("courseId")
      .notEmpty()
      .withMessage("코스 아이디가 없습니다.")
      .isNumeric()
      .withMessage("코스 아이디가 숫자가 아닙니다."),
    body("title")
      .notEmpty()
      .withMessage("제목이 없습니다."),
    body("description")
      .notEmpty()
      .withMessage("설명이 없습니다."),
  ],
  publicCourseController.createPublicCourse
);

publicCourseRouter.get(
  "/",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
  ],
  publicCourseController.recommendPublicCourse
);

publicCourseRouter.get(
  "/user",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
  ],
  publicCourseController.getPublicCourseByUser
);

publicCourseRouter.get(
  "/detail/:publicCourseId",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
    param("publicCourseId")
      .notEmpty()
      .withMessage("퍼블릭 코스 아이디가 없습니다.")
      .isNumeric()
      .withMessage("퍼블릭 코스 아이디가 숫자가 아닙니다."),
  ],
  publicCourseController.getPublicCourseDetail
);
publicCourseRouter.get(
  "/search",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
    query("keyword")
      .notEmpty()
      .withMessage("검색어가 없습니다."),
  ],
  publicCourseController.searchPublicCourse
);

publicCourseRouter.delete(
  "/:publicCourseId",
  [
    param("publicCourseId")
      .notEmpty()
      .withMessage("퍼블릭 코스 아이디가 없습니다.")
      .isNumeric()
      .withMessage("퍼블릭 코스 아이디가 숫자가 아닙니다."),
  ],
  publicCourseController.deletePublicCourse
);

export default publicCourseRouter;
