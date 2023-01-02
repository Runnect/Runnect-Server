import { Router } from "express";
import courseRouter from "./courseRouter";

const router: Router = Router();

router.use("/course", courseRouter);

export default router;
