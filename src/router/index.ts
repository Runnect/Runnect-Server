import { Router } from "express";
import publicCourseRouter from "./publicCourseRouter";
import courseRouter from "./courseRouter";
import recordRouter from "./recordRouter";

const router: Router = Router();

router.use("/public-course", publicCourseRouter);
router.use("/course", courseRouter);
router.use("/record", recordRouter);

export default router;