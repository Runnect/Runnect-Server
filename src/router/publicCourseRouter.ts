import { Router } from "express";
import { body } from "express-validator";
import { publicCourseController } from "../controller";

const publicCourseRouter: Router = Router();

publicCourseRouter.post("/", publicCourseController.createPublicCourse);
publicCourseRouter.get("/", publicCourseController.recommendPublicCourse);
publicCourseRouter.get("/user", publicCourseController.getPublicCourseByUser);
publicCourseRouter.get("/detail/:publicCourseId", publicCourseController.getPublicCourseDetail);
publicCourseRouter.get("search", publicCourseController.searchPublicCourse);

export default publicCourseRouter;
