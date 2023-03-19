import { Router } from "express";
import { body, header } from "express-validator";
import { rm } from "../constant";

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

authRouter.get(
  "/getNewToken",
  [
    //원래 auth 미들웨어에서 토큰들의 유무를 검사하나, 재발급시는 auth 미들웨어를 사용하지 않기에 express validator를 사용해 값의 유무 검사
    header("refreshToken")
      .notEmpty()
      .withMessage(rm.EMPTY_TOKEN),
    header("accessToken")
      .notEmpty()
      .withMessage(rm.EMPTY_TOKEN),
  ],
  authController.getNewToken
);

export default authRouter;
