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
const constant_1 = require("../constant");
const response_1 = require("../constant/response");
const express_validator_1 = require("express-validator");
const service_1 = require("../service");
const getStampByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const userId = req.body.userId;
    try {
        const stampByUser = yield service_1.stampService.getStampByUser(userId);
        if (!stampByUser) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.BAD_REQUEST));
        }
        else {
            const stamps = stampByUser.map((sbu) => {
                let stamp = {
                    id: sbu.stamp_id,
                };
                return stamp;
            });
            const stampGetDto = {
                user: {
                    id: userId,
                },
                stamps: stamps,
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_STAMP_BY_USER, stampGetDto));
        }
    }
    catch (error) {
        console.log(error);
        //서버내부오류
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const stampController = { getStampByUser };
exports.default = stampController;
//# sourceMappingURL=stampController.js.map