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
//course api 중 이미지  처리단이 있어 auth작업은 이미지 처리 이후에 해야함
router.use("/course", courseRouter);

router.use("/record", auth, recordRouter);
router.use("/user", auth, userRouter);
router.use("/scrap", auth, scrapRouter);
router.use("/stamp", auth, stampRouter);
router.use("/auth", authRouter);

export default router;
