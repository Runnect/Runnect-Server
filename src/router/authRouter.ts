import { Router } from "express";
import { body } from "express-validator";
import { authController } from "../controller";

const authRouter: Router = Router();

authRouter.post(
  "/",
  [
    body("token")
      .notEmpty()
      .withMessage("토큰이 없습니다."),
    body("provider")
      .notEmpty()
      .withMessage("provider 정보가 없습니다."),
  ],
  authController.getSocialLoginInfo
);

export default authRouter;
