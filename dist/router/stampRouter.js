"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = require("../controller");
const stampRouter = (0, express_1.Router)();
stampRouter.get("/user", [
    (0, express_validator_1.header)("machineId")
        .notEmpty()
        .withMessage("기기넘버가 없습니다."),
], controller_1.stampController.getStampByUser);
exports.default = stampRouter;
//# sourceMappingURL=stampRouter.js.map