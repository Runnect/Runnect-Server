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
const service_1 = require("../service");
const constant_1 = require("../constant");
const response_1 = require("../constant/response");
const express_validator_1 = require("express-validator");
const convertTime_1 = require("../module/convert/convertTime");
const checkScrap_1 = require("../module/check/checkScrap");
const createPublicCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    //에러처리 1 : 필요한 정보(courseId, title, description이 안들어왔을때)
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const publicCourseCreateRequestDTO = req.body;
    try {
        const createdPublicCourse = yield service_1.publicCourseService.createPublicCourse(publicCourseCreateRequestDTO);
        if (!createdPublicCourse) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.BAD_REQUEST));
        }
        else if (typeof createdPublicCourse === "string" || createdPublicCourse instanceof String) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, createdPublicCourse));
        }
        else {
            //db에서 출력받은 timestamp를 string으로 변환
            const createdAt = (0, convertTime_1.dateConvertString)(createdPublicCourse.created_at);
            const publicCourseCreateResponseDTO = {
                publicCourse: {
                    createdAt: createdAt,
                    id: createdPublicCourse.id,
                },
            };
            return res.status(constant_1.sc.CREATED).send((0, response_1.success)(constant_1.sc.CREATED, constant_1.rm.UPLOAD_PUBLIC_COURSE, publicCourseCreateResponseDTO));
        }
    }
    catch (error) {
        console.log(error);
        //서버내부오류
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const getPublicCourseByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    //에러처리 1 : 필요한 정보(machineId이 안들어왔을때)
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    try {
        const publicCourseByUser = yield service_1.publicCourseService.getPublicCourseByUser(machineId);
        if (!publicCourseByUser || publicCourseByUser.length == 0) {
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_PUBLIC_COURSE_BY_USER, publicCourseByUser));
        }
        else {
            const publicCourses = publicCourseByUser.map((pc) => {
                let publicCourse = {
                    id: pc.PublicCourse.id,
                    courseId: pc.id,
                    title: pc.PublicCourse.title,
                    image: pc.image,
                    departure: {
                        region: pc.departure_region,
                        city: pc.departure_city,
                    },
                };
                return publicCourse;
            });
            const publicCourseGetDTO = {
                user: {
                    machineId: machineId,
                },
                publicCourses: publicCourses,
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_PUBLIC_COURSE_BY_USER, publicCourseGetDTO));
        }
    }
    catch (error) {
        console.log(error);
        //서버내부오류
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const getPublicCourseDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    //에러처리 1 : 필요한 정보(machineId, publicCourseId가 안들어왔을때)
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    const { publicCourseId } = req.params; //위에서 검사했어도 스트링으로옴
    try {
        const publicCourseDetail = yield service_1.publicCourseService.getPublicCourseDetail(machineId, +publicCourseId); //퍼블릭 코스아이디 number로 타입변환
        if (!publicCourseDetail) {
            res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.INVALID_PUBLIC_COURSE_ID));
        }
        else {
            const publicCourseDetailGetDTO = {
                user: {
                    nickname: publicCourseDetail.Course.User.nickname,
                    level: publicCourseDetail.Course.User.level,
                    image: publicCourseDetail.Course.User.latest_stamp,
                },
                publicCourse: {
                    id: publicCourseDetail.id,
                    courseId: publicCourseDetail.course_id,
                    scrap: (0, checkScrap_1.checkScrap)(publicCourseDetail.Scrap),
                    image: publicCourseDetail.Course.image,
                    title: publicCourseDetail.title,
                    description: publicCourseDetail.description,
                    distance: publicCourseDetail.Course.distance,
                    departure: {
                        region: publicCourseDetail.Course.departure_region,
                        city: publicCourseDetail.Course.departure_city,
                        town: publicCourseDetail.Course.departure_town,
                        name: publicCourseDetail.Course.departure_name,
                    },
                },
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_PUBLIC_COURSE_DETAIL_SUCCESS, publicCourseDetailGetDTO));
        }
    }
    catch (error) {
        console.log(error);
        //서버내부오류
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const recommendPublicCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    //에러처리 1 : 필요한 정보(machineId이 안들어왔을때)
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    try {
        const recommendedPublicCourse = yield service_1.publicCourseService.recommendPublicCourse(machineId);
        if (!recommendedPublicCourse || recommendedPublicCourse.length == 0) {
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_RECOMMENDED_COURSE_SUCCESS, recommendedPublicCourse));
        }
        else {
            const publicCourses = recommendedPublicCourse.map((rbc) => {
                const pc = {
                    id: rbc.id,
                    courseId: rbc.course_id,
                    title: rbc.title,
                    image: rbc.Course.image,
                    scarp: (0, checkScrap_1.checkScrap)(rbc.Scrap),
                    departure: {
                        region: rbc.Course.departure_region,
                        city: rbc.Course.departure_city,
                    },
                };
                return pc;
            });
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_RECOMMENDED_COURSE_SUCCESS, { publicCourses }));
        }
    }
    catch (error) {
        console.log(error);
        //서버내부오류
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const searchPublicCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    //에러처리 1 : 필요한 정보(machineId, keyword이 안들어왔을때)
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    const { keyword } = req.query;
    try {
        const searchedPublicCourse = yield service_1.publicCourseService.searchPublicCourse(machineId, keyword);
        if (!searchedPublicCourse || searchedPublicCourse.length == 0) {
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_SEARCHED_COURSE_SUCCESS, searchedPublicCourse));
        }
        else {
            const publicCourses = searchedPublicCourse.map((spc) => {
                const pc = {
                    id: spc.id,
                    courseId: spc.course_id,
                    title: spc.title,
                    image: spc.Course.image,
                    scarp: (0, checkScrap_1.checkScrap)(spc.Scrap),
                    departure: {
                        region: spc.Course.departure_region,
                        city: spc.Course.departure_city,
                    },
                };
                return pc;
            });
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_SEARCHED_COURSE_SUCCESS, { publicCourses }));
        }
    }
    catch (error) {
        console.log(error);
        //서버내부오류
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const publicCourseController = {
    createPublicCourse,
    getPublicCourseByUser,
    getPublicCourseDetail,
    recommendPublicCourse,
    searchPublicCourse,
};
exports.default = publicCourseController;
//# sourceMappingURL=publicCourseController.js.map