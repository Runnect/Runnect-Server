"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicCourseRouter_1 = __importDefault(require("./publicCourseRouter"));
const courseRouter_1 = __importDefault(require("./courseRouter"));
const recordRouter_1 = __importDefault(require("./recordRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const scrapRouter_1 = __importDefault(require("./scrapRouter"));
const stampRouter_1 = __importDefault(require("./stampRouter"));
const router = (0, express_1.Router)();
router.use("/public-course", publicCourseRouter_1.default);
router.use("/course", courseRouter_1.default);
router.use("/record", recordRouter_1.default);
router.use("/user", userRouter_1.default);
router.use("/scrap", scrapRouter_1.default);
router.use("/stamp", stampRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map