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
    //에러처리 1 : 필요한 정보가 없을때
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const userId = req.body.userId;
    try {
        const publicCourseByUser = yield service_1.publicCourseService.getPublicCourseByUser(userId);
        if (!publicCourseByUser) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.READ_PUBLIC_COURSE_FAIL));
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
                    id: userId,
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
    const userId = req.body.userId;
    const { publicCourseId } = req.params; //위에서 검사했어도 스트링으로옴
    try {
        const publicCourseDetail = yield service_1.publicCourseService.getPublicCourseDetail(userId, +publicCourseId); //퍼블릭 코스아이디 number로 타입변환
        if (!publicCourseDetail || publicCourseDetail.length == 0) {
            res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.INVALID_PUBLIC_COURSE_ID));
        }
        else {
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_PUBLIC_COURSE_DETAIL_SUCCESS, publicCourseDetail));
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
    const userId = req.body.userId;
    // countPerPage -> 페이지 크기(한 페이지에 몇 개의 데이터)
    const pageSize = 24; // 20개씩 넘겨줌
    // pageNo -> 페이지 번호(몇 번 페이지)
    let pageNo = parseInt(req.query.pageNo);
    // 페이지번호가 요청으로 들어오지 않을시 자동으로 1번 req
    if (!pageNo)
        pageNo = 1;
    try {
        const recommendedPublicCourse = yield service_1.publicCourseService.recommendPublicCourse(userId, pageSize, pageNo);
        // 가지고 있는 데이터보다 더 큰 페이지 번호를 요청했을 경우
        if (recommendedPublicCourse == "invalidPageNo") {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.INVALID_PAGE_NUMBER));
        }
        if (!recommendedPublicCourse) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.READ_PUBLIC_COURSE_FAIL));
        }
        else {
            const publicCourses = recommendedPublicCourse.map((rbc) => {
                const pc = {
                    pageNo: pageNo,
                    id: rbc.id,
                    courseId: rbc.course_id,
                    title: rbc.title,
                    image: rbc.Course.image,
                    scrap: (0, checkScrap_1.checkScrap)(rbc.Scrap),
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
    //에러처리 1 : 필요한 정보가 안들어왔을때
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const userId = req.body.userId;
    const { keyword } = req.query;
    try {
        const searchedPublicCourse = yield service_1.publicCourseService.searchPublicCourse(userId, keyword);
        if (!searchedPublicCourse) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.READ_PUBLIC_COURSE_FAIL));
        }
        else {
            const publicCourses = searchedPublicCourse.map((spc) => {
                const pc = {
                    id: spc.id,
                    courseId: spc.course_id,
                    title: spc.title,
                    image: spc.Course.image,
                    scrap: (0, checkScrap_1.checkScrap)(spc.Scrap),
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
const updatePublicCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    //에러처리 1 : 필요한 정보(courseId, title, description)가 안들어왔을때
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const { publicCourseId } = req.params;
    const UpdatePublicCourseDTO = req.body;
    try {
        const updatePublicCourse = yield service_1.publicCourseService.updatePublicCourse(+publicCourseId, UpdatePublicCourseDTO);
        if (!updatePublicCourse) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.INVALID_PUBLIC_COURSE_ID));
        }
        else {
            const updatedPublicCourseResponseDTO = {
                publicCourse: { id: updatePublicCourse.id, title: updatePublicCourse.title, description: updatePublicCourse.description },
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.UPDATE_COURSE_SUCCESS, updatedPublicCourseResponseDTO));
        }
    }
    catch (error) {
        console.log(error);
        //서버내부오류
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const deletePublicCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const publicCourseIdList = req.body.publicCourseIdList;
    try {
        const data = yield service_1.publicCourseService.deletePublicCourse(publicCourseIdList);
        if (!data)
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.DELETE_PUBLIC_COURSE_FAIL));
        else if (typeof data == "string") {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, data));
        }
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.DELETE_PUBLIC_COURSE_SUCCESS, { deletedPublicCourseCount: data }));
    }
    catch (e) {
        console.error(e);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const publicCourseController = {
    createPublicCourse,
    getPublicCourseByUser,
    getPublicCourseDetail,
    recommendPublicCourse,
    searchPublicCourse,
    updatePublicCourse,
    deletePublicCourse,
};
exports.default = publicCourseController;
//# sourceMappingURL=publicCourseController.js.map