import { Router } from "express";
import { courseController } from "../controller";
import { header, body, param } from "express-validator";

const router: Router = Router();

router.get(
    "/user",
    [
        header("machineId").notEmpty(),
    ],
    courseController.getCourseByUser
);

router.get(
    "/private/user",
    [
        header("machineId").notEmpty(),
    ],
    courseController.getPrivateCourseByUser
);

router.get(
    "/detail/:courseId",
    [
        header("machineId").notEmpty().withMessage("기기넘버가 없습니다."),
        param("courseId").notEmpty().withMessage("코스 아이디가 없습니다.").isNumeric().withMessage("코스 아이디가 숫자가 아닙니다."),
    ],
    courseController.getCourseDetail
);

export default router;