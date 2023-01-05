import { Router } from "express";
import { body, header } from "express-validator";
import { recordController } from "../controller";

const recordRouter: Router = Router();

recordRouter.post(
  "/",
  [
    header("machineId")
      .notEmpty()
      .withMessage("기기넘버가 없음"),
    body("courseId")
      .notEmpty()
      .withMessage("코스 아이디가 없음")
      .isNumeric()
      .withMessage("유효하지 않은 코스 아이디"),
    body("title")
      .notEmpty()
      .withMessage("경로 타이틀이 없음"),
    body("pace")
      .notEmpty()
      .withMessage("경로 뛴 페이스 없음"),
    body("time")
      .notEmpty()
      .withMessage("경로 뛴 시간 없음"),
  ],
  recordController.createRecord
);

export default recordRouter;
