import { Router } from "express";
import { body } from "express-validator";
import { publicCourseController } from "../controller";

const publicCourseRouter: Router = Router();

publicCourseRouter.post("/", publicCourseController.createPublicCourse);

export default publicCourseRouter;
