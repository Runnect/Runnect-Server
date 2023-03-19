import { Router } from "express";
import auth from "../middleware/auth";
import publicCourseRouter from "./publicCourseRouter";
import courseRouter from "./courseRouter";
import recordRouter from "./recordRouter";
import userRouter from "./userRouter";
import scrapRouter from "./scrapRouter";
import stampRouter from "./stampRouter";
import authRouter from "./authRouter";

const router: Router = Router();

router.use("/public-course", auth, publicCourseRouter);
router.use("/course", auth, courseRouter);
router.use("/record", auth, recordRouter);
router.use("/user", auth, userRouter);
router.use("/scrap", auth, scrapRouter);
router.use("/stamp", auth, stampRouter);
router.use("/auth", authRouter);

export default router;
