import { Router } from "express";
import publicCourseRouter from "./publicCourseRouter";
import courseRouter from "./courseRouter";
import recordRouter from "./recordRouter";
import userRouter from "./userRouter";
import scrapRouter from "./scrapRouter";
import stampRouter from "./stampRouter";

const router: Router = Router();

router.use("/public-course", publicCourseRouter);
router.use("/course", courseRouter);
router.use("/record", recordRouter);
router.use("/user", userRouter);
router.use("/scrap", scrapRouter);
router.use("/stamp", stampRouter);

export default router;
