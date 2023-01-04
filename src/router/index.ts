import { Router } from "express";
import publicCourseRouter from "./publicCourseRouter";
import recordRouter from "./recordRouter";

const router: Router = Router();

router.use("/public-course", publicCourseRouter);
router.use("/record", recordRouter);

export default router;
