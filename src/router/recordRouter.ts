import { Router } from "express";
import { recordController } from "../controller";

const recordRouter: Router = Router();

recordRouter.post("/", recordController.createRecord);

export default recordRouter;
