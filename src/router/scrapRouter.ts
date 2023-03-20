import { Router } from "express";
import { body, header } from "express-validator";
import { scrapController } from "../controller";

const scrapRouter: Router = Router();

scrapRouter.post(
  "/",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
    body("publicCourseId")
      .notEmpty()
      .withMessage("퍼블릭 코스 아이디가 없음")
      .isNumeric()
      .withMessage("유효하지 않은 퍼블릭 코스 아이디"),
    body("scrapTF")
      .notEmpty()
      .withMessage("스크랩 여부가 없음.")
      .isBoolean()
      .withMessage(" 스크랩 여부가 True or False 값이 아님"),
  ],
  scrapController.createAndDeleteScrap
);

scrapRouter.get(
  "/user",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
  ],
  scrapController.getScrapCourseByUSer
);

export default scrapRouter;
