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
const requestConvertDeparture_1 = require("../module/convert/requestConvertDeparture");
const coorConverPath_1 = require("../module/convert/coorConverPath");
/**
 * @route  POST/course
 * @desc 경로 그리기
 */
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    console.log(req.body);
    const image = req.file;
    if (!image)
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NO_IMAGE));
    const { location } = image;
    const departureObject = (0, requestConvertDeparture_1.requestConvertDeparture)(req.body.departureAddress, req.body.departureName);
    if (!departureObject)
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.DEPARTURE_VALIDATION_ERROR));
    const courseCreateDTO = {
        machineId: req.header("machineId"),
        path: (0, coorConverPath_1.coorConvertPath)(req.body.path),
        distance: Number(req.body.distance),
        region: departureObject.region,
        city: departureObject.city,
        town: departureObject.town,
        detail: departureObject.detail,
        name: departureObject.name,
        image: location,
    };
    try {
        const data = yield service_1.courseService.createCourse(courseCreateDTO);
        if (!data) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.CREATE_COURSE_FAIL));
        }
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.CREATE_COURSE_SUCCESS, data));
    }
    catch (e) {
        console.error(e);
        return res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route  GET/course/user
 * @desc 내가 그린 코스 조회 (업로드 포함)
 */
const getCourseByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty())
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NO_USER));
    const machineId = req.header("machineId");
    try {
        const data = yield service_1.courseService.getCourseByUser(machineId);
        if (data == "NO_USER")
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NO_USER));
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_COURSE_SUCCESS, data));
    }
    catch (error) {
        console.error(error);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route  GET/course/private/user
 * @desc 내가 그린 코스 조회 (업로드 미포함)
 */
const getPrivateCourseByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty())
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NO_USER));
    const machineId = req.header("machineId");
    try {
        const data = yield service_1.courseService.getPrivateCourseByUser(machineId);
        if (data == "NO_USER")
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NO_USER));
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_PRIVATE_COURSE_SUCCESS, data));
    }
    catch (error) {
        console.error(error);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
/**
 * @route  GET/course/detail/:courseId
 * @desc 내가 그린 코스 상세 페이지와 달리기 기능
 */
const getCourseDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    const { courseId } = req.params;
    try {
        const data = yield service_1.courseService.getCourseDetail(machineId, +courseId);
        if (!data)
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NO_COURSE));
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_COURSE_SUCCESS, data));
    }
    catch (e) {
        console.error(e);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const courseController = {
    createCourse,
    getCourseByUser,
    getPrivateCourseByUser,
    getCourseDetail,
};
exports.default = courseController;
//# sourceMappingURL=courseController.js.map