import { Router } from "express";
import { body, header, param } from "express-validator";
import { recordController } from "../controller";

const recordRouter: Router = Router();

recordRouter.post(
  "/",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
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

recordRouter.get(
  "/user",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
  ],
  recordController.getRecordByUser
);

recordRouter.patch(
  "/:recordId",
  [
    param("recordId")
      .notEmpty()
      .withMessage("레코드 아이디가 없습니다.")
      .isNumeric()
      .withMessage("레코드 아이디가 숫자가 아닙니다."),
    body("title")
      .notEmpty()
      .withMessage("수정할 제목이 없습니다."),
  ],
  recordController.updateRecord
);

recordRouter.put(
  "/",
  [
    body("recordIdList")
      .notEmpty()
      .withMessage("기록 아이디가 없습니다.")
  ],
  recordController.deleteRecord
);

export default recordRouter;
