"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = require("../controller");
const router = (0, express_1.Router)();
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
router.get("/", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
], controller_1.userController.getUser);
router.patch("/", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
    (0, express_validator_1.body)("nickname")
        .notEmpty()
        .withMessage("닉네임이 없습니다."),
], controller_1.userController.updateUserNickname);
router.delete(
//토큰 여부는 auth middleware에서 검사함
"/", controller_1.userController.deleteUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map