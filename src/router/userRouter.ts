import { Router } from "express";
import { header, body } from "express-validator";
import { userController } from "../controller";

const router: Router = Router();

/*
router.post(
  "/",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
    body("nickname")
      .notEmpty()
      .withMessage("닉네임이 없습니다."),
  ],
  userController.signUp
);*/

router.get(
  "/",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
  ],
  userController.getUser
);

router.patch(
  "/",
  [
    body("userId")
      .notEmpty()
      .withMessage("유저 아이디가 없습니다.")
      .isNumeric()
      .withMessage("유저아이디가 숫자가 아닙니다."),
    body("nickname")
      .notEmpty()
      .withMessage("닉네임이 없습니다."),
  ],
  userController.updateUserNickname
);

router.delete(
  //토큰 여부는 auth middleware에서 검사함
  "/",
  userController.deleteUser
);

export default router;
