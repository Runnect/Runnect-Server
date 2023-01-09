"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = require("../controller");
const router = (0, express_1.Router)();
router.post("/", [
    (0, express_validator_1.header)("machineId")
        .notEmpty()
        .withMessage("기기넘버가 없습니다."),
    (0, express_validator_1.body)("nickname")
        .notEmpty()
        .withMessage("닉네임이 없습니다."),
], controller_1.userController.signUp);
router.get("/", [
    (0, express_validator_1.header)("machineId")
        .notEmpty()
        .withMessage("기기넘버가 없습니다."),
], controller_1.userController.getUser);
router.patch("/", [
    (0, express_validator_1.header)("machineId")
        .notEmpty()
        .withMessage("기기넘버가 없습니다."),
    (0, express_validator_1.body)("nickname")
        .notEmpty()
        .withMessage("닉네임이 없습니다."),
], controller_1.userController.updateUserNickname);
exports.default = router;
//# sourceMappingURL=userRouter.js.map