"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const publicCourseRouter_1 = __importDefault(require("./publicCourseRouter"));
const courseRouter_1 = __importDefault(require("./courseRouter"));
const recordRouter_1 = __importDefault(require("./recordRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const scrapRouter_1 = __importDefault(require("./scrapRouter"));
const stampRouter_1 = __importDefault(require("./stampRouter"));
const authRouter_1 = __importDefault(require("./authRouter"));
const router = (0, express_1.Router)();
router.use("/public-course", auth_1.default, publicCourseRouter_1.default);
//course api 중 이미지  처리단이 있어 auth작업은 이미지 처리 이후에 해야함
router.use("/course", courseRouter_1.default);
router.use("/record", auth_1.default, recordRouter_1.default);
router.use("/user", auth_1.default, userRouter_1.default);
router.use("/scrap", auth_1.default, scrapRouter_1.default);
router.use("/stamp", auth_1.default, stampRouter_1.default);
router.use("/auth", authRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map