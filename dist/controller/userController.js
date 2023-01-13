"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const response_1 = require("./../constant/response");
const constant_1 = require("../constant");
const service_1 = require("../service");
/**
 * @route  POST/user/
 * @desc 회원가입
 */
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    const { nickname } = req.body;
    try {
        const createdUser = yield service_1.userService.signUp(machineId, nickname);
        if (!createdUser) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.SIGNUP_FAIL));
        }
        else if (createdUser == "success") {
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.SIGNUP_SUCCESS));
        }
        else {
            res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, createdUser));
        }
    }
    catch (e) {
        console.error(e);
        return res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    try {
        const data = yield service_1.userService.getUser(machineId);
        if (!data)
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.READ_USER_FAIL));
        console.log(data);
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_USER_SUCCESS, data));
    }
    catch (e) {
        console.error(e);
        return res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route  PATCH/user/
 * @desc 닉네임 변경
 */
const updateUserNickname = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    const { nickname } = req.body;
    try {
        const data = yield service_1.userService.updateUserNickname(machineId, nickname);
        if (!data)
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.UPDATE_USER_FAIL));
        else if (typeof data == "string") {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, data));
        }
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.UPDATE_USER_SUCCESS, data));
    }
    catch (e) {
        console.error(e);
        return res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const userController = {
    signUp,
    getUser,
    updateUserNickname,
};
exports.default = userController;
//# sourceMappingURL=userController.js.map