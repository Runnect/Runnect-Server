import { Router } from "express";
import publicCourseRouter from "./publicCourseRouter";
import courseRouter from "./courseRouter";

const router: Router = Router();

router.use("/public-course", publicCourseRouter);
router.use("/course", courseRouter);

export default router;