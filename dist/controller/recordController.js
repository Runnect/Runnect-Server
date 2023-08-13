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
const convertTime_1 = require("../module/convert/convertTime");
const service_1 = require("../service");
const createRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            const errorMsg = error["errors"][0].msg;
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, errorMsg));
        }
        const { userId, courseId, publicCourseId, title, time, pace } = req.body;
        const recordRequestDTO = {
            userId: userId,
            courseId: courseId,
            publicCourseId: publicCourseId,
            title: title,
            time: (0, convertTime_1.stringConvertTime)(time),
            pace: (0, convertTime_1.stringConvertTime)(pace),
        };
        const record = yield service_1.recordService.createRecord(recordRequestDTO);
        if (!record) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.BAD_REQUEST));
        }
        else if (typeof record === "string" || record instanceof String) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, record));
        }
        else {
            const createdAt = (0, convertTime_1.dateConvertString)(record.created_at);
            const recordResponseDTO = {
                record: {
                    id: record.id,
                    createdAt: createdAt,
                },
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.CREATED, constant_1.rm.UPLOAD_RECORD, recordResponseDTO));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const getRecordByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const userId = req.body.userId;
    try {
        const getRecordByUser = yield service_1.recordService.getRecordByUser(userId);
        if (!getRecordByUser) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NO_USER));
        }
        else {
            const recordsArray = getRecordByUser.map((pc) => {
                let record = {
                    id: pc.id,
                    courseId: pc.Course.id,
                    publicCourseId: pc.public_course_id,
                    userId: userId,
                    title: pc.title,
                    image: pc.Course.image,
                    createdAt: (0, convertTime_1.dateConvertString)(pc.created_at),
                    distance: pc.Course.distance,
                    time: (0, convertTime_1.dateConvertString)(pc.time).substring(11, 19),
                    pace: (0, convertTime_1.dateConvertString)(pc.pace).substring(11, 19),
                    departure: {
                        region: pc.Course.departure_region,
                        city: pc.Course.departure_city,
                    },
                };
                return record;
            });
            const getRecordByUserResponseDTO = {
                user: { id: userId },
                records: recordsArray,
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_RECORD_SUCCESS, getRecordByUserResponseDTO));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const updateRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const { recordId } = req.params;
    const title = req.body.title;
    try {
        const updateRecord = yield service_1.recordService.updateRecord(+recordId, title);
        if (!updateRecord) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NO_RECORD_ID));
        }
        else {
            const updateRecordResponseDTO = {
                record: {
                    id: updateRecord.id,
                    title: updateRecord.title,
                },
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.UPDATE_RECORD_SUCCESS, updateRecordResponseDTO));
        }
    }
    catch (error) {
        console.log(error);
        //서버내부오류
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const deleteRecord = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const recordIdList = req.body.recordIdList;
    try {
        const data = yield service_1.recordService.deleteRecord(recordIdList);
        if (!data)
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.DELETE_RECORD_FAIL));
        else if (typeof data == "string") {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, data));
        }
        return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.DELETE_RECORD_SUCCESS, { deletedRecordIdCount: data }));
    }
    catch (error) {
        console.log(error);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const recordController = { createRecord, getRecordByUser, updateRecord, deleteRecord };
exports.default = recordController;
//# sourceMappingURL=recordController.js.map