import { Router } from "express";
import { body } from "express-validator";

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
        body("idKey")
            .notEmpty()
            .withMessage("idKey가 없습니다.")
    ],
    authController.getSocialLoginInfo //* controller단 함수 이름 임시로 지었어용
);

export default authRouter;
