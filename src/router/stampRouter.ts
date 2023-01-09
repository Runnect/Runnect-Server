import { Router } from "express";
import { header } from "express-validator";
import { stampController } from "../controller";

const stampRouter: Router = Router();

stampRouter.get(
  "/user",
  [
    header("machineId")
      .notEmpty()
      .withMessage("기기넘버가 없습니다."),
  ],

  stampController.getStampByUser
);

export default stampRouter;
