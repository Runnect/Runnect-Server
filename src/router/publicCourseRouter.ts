import { Router } from "express";
import { body, header } from "express-validator";
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
    header("machineId")
      .notEmpty()
      .withMessage("기기넘버가 없습니다."),
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
  publicCourseController.recommendPublicCourse
);
publicCourseRouter.get("/user", publicCourseController.getPublicCourseByUser);
publicCourseRouter.get("/detail/:publicCourseId", publicCourseController.getPublicCourseDetail);
publicCourseRouter.get("search", publicCourseController.searchPublicCourse);

export default publicCourseRouter;
