import { Router } from "express";
import { header, body } from "express-validator";
import { userController } from "../controller";
const passport = require("passport");

const router: Router = Router();

router.post(
  "/",
  [
    header("machineId")
      .notEmpty()
      .withMessage("기기넘버가 없습니다."),
    body("nickname")
      .notEmpty()
      .withMessage("닉네임이 없습니다."),
  ],
  userController.signUp
);

router.get(
  "/",
  [
    header("machineId")
      .notEmpty()
      .withMessage("기기넘버가 없습니다."),
  ],
  userController.getUser
);

router.patch(
  "/",
  [
    header("machineId")
      .notEmpty()
      .withMessage("기기넘버가 없습니다."),
    body("nickname")
      .notEmpty()
      .withMessage("닉네임이 없습니다."),
  ],
  userController.updateUserNickname
);

router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
