import { Router } from "express";
import { body } from "express-validator";
import { stampController } from "../controller";

const stampRouter: Router = Router();

stampRouter.get(
  "/user",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
  ],

  stampController.getStampByUser
);

export default stampRouter;
