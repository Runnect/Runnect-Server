"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = require("../controller");
const recordRouter = (0, express_1.Router)();
recordRouter.post("/", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
    (0, express_validator_1.body)("courseId")
        .notEmpty()
        .withMessage("코스 아이디가 없음")
        .isNumeric()
        .withMessage("유효하지 않은 코스 아이디"),
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("경로 타이틀이 없음"),
    (0, express_validator_1.body)("pace")
        .notEmpty()
        .withMessage("경로 뛴 페이스 없음"),
    (0, express_validator_1.body)("time")
        .notEmpty()
        .withMessage("경로 뛴 시간 없음"),
], controller_1.recordController.createRecord);
recordRouter.get("/user", [
    (0, express_validator_1.body)("userId")
        .notEmpty()
        .withMessage("유저 아이디가 없습니다.")
        .isNumeric()
        .withMessage("유저아이디가 숫자가 아닙니다."),
], controller_1.recordController.getRecordByUser);
recordRouter.patch("/:recordId", [
    (0, express_validator_1.param)("recordId")
        .notEmpty()
        .withMessage("레코드 아이디가 없습니다.")
        .isNumeric()
        .withMessage("레코드 아이디가 숫자가 아닙니다."),
    (0, express_validator_1.body)("title")
        .notEmpty()
        .withMessage("수정할 제목이 없습니다."),
], controller_1.recordController.updateRecord);
recordRouter.put("/", [
    (0, express_validator_1.body)("recordIdList")
        .notEmpty()
        .withMessage("기록 아이디가 없습니다.") //recordIdList=[] 인경우도 여기에서 걸러짐
        .isArray()
        .withMessage("기록 아이디들이 리스트 형식이 아닙니다"),
    (0, express_validator_1.body)("recordIdList.*") //recordIdList=["ㅇ","ㅇ"] 인 경우를 여기에서 거름
        .isNumeric()
        .withMessage("기록 아이디들이 숫자가 아닙니다."),
], controller_1.recordController.deleteRecord);
exports.default = recordRouter;
//# sourceMappingURL=recordRouter.js.map