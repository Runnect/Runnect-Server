import { Router } from "express";
import publicCourseRouter from "./publicCourseRouter";

const router: Router = Router();

router.use("/public-course", publicCourseRouter);

export default router;
