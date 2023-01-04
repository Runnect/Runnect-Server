import { Router } from "express";
import { courseController } from "../controller";
import { header, body } from "express-validator";

const router: Router = Router();

router.get(
    "/user",
    [
        header("machineId").notEmpty(),
    ],
    courseController.getCourseByUser
);

export default router;