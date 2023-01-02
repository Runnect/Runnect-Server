import { Router } from "express";
import { courseController } from "../controller";
import { header, body } from "express-validator";
import { upload } from "../middleware";

const router: Router = Router();

router.post(
    "/",
    upload.single('image'),
    [
        header("machineId").notEmpty(),
        body("path").notEmpty(),
        body("distance").notEmpty(),
        body("departureAddress").notEmpty(),
        body("departureName").notEmpty(),
    ],
    courseController.createCourse
);

export default router;