import { Router } from "express";
import { body, header } from "express-validator";
import { scrapController } from "../controller";

const scrapRouter: Router = Router();

scrapRouter.post(
  "/",
  [
    header("machineId")
      .notEmpty()
      .withMessage("기기넘버가 없음"),
    body("publicCourseId")
      .notEmpty()
      .withMessage("코스 아이디가 없음")
      .isNumeric()
      .withMessage("유효하지 않은 코스 아이디"),
    body("scrapTF")
      .notEmpty()
      .withMessage("스크랩 여부가 없음"),
  ],
  scrapController.createAndDeleteScrap
);

export default scrapRouter;
