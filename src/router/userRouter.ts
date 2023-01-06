import { Router } from "express";
import { header, body } from "express-validator";
import { userController } from "../controller";

const router: Router = Router();

router.post(
    "/",
    [
        header("machineId").notEmpty().withMessage("기기넘버가 없습니다."),
        body("nickname").notEmpty().withMessage("닉네임이 없습니다."),
    ],
    userController.singUp
);

router.get(
    "/",
    [
        header("machineId").notEmpty().withMessage("기기넘버가 없습니다."),
    ],
    userController.getUser
);

export default router;