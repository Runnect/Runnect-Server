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
const createAndDeleteScrap = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    const { publicCourseId, scrapTF } = req.body;
    const scrapDTO = {
        machineId: machineId,
        publicCourseId: +publicCourseId,
        scrapTF: scrapTF,
    };
    try {
        if (scrapTF == true || scrapTF == "true") {
            const createScrap = yield service_1.scrapService.createScrap(scrapDTO);
            if (!createScrap) {
                return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.BAD_REQUEST));
            }
            else if (typeof createScrap === "string" || createScrap instanceof String) {
                return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, createScrap));
            }
            else {
                return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.CREATE_SCRAP_SUCCESS));
            }
        }
        else {
            const deleteScrap = yield service_1.scrapService.deleteScrap(scrapDTO);
            if (!deleteScrap) {
                return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.BAD_REQUEST));
            }
            else {
                return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.DELETE_SCRAP_SUCCESS));
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const getScrapCourseByUSer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const error = (0, express_validator_1.validationResult)(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, validationErrorMsg));
    }
    const machineId = req.header("machineId");
    try {
        const getScrapCourse = yield service_1.scrapService.getScrapCourseByUser(machineId);
        if (!getScrapCourse) {
            return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.BAD_REQUEST));
        }
        else {
            const scrapsArray = getScrapCourse.map((pc) => {
                console.log(pc);
                let scrap = {
                    id: pc.id,
                    publicCourseId: pc.public_course_id,
                    courseId: pc.PublicCourse.Course.id,
                    title: pc.PublicCourse.title,
                    image: pc.PublicCourse.Course.image,
                    departure: {
                        region: pc.PublicCourse.Course.departure_region,
                        city: pc.PublicCourse.Course.departure_city,
                    },
                };
                return scrap;
            });
            const getScrapResponseDTO = {
                user: {
                    machineId: machineId,
                },
                Scraps: scrapsArray,
            };
            return res.status(constant_1.sc.OK).send((0, response_1.success)(constant_1.sc.OK, constant_1.rm.READ_SCRAP_COURSE_SUCCESS, getScrapResponseDTO));
        }
    }
    catch (error) {
        console.log(error);
        return res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
});
const scrapController = { createAndDeleteScrap, getScrapCourseByUSer };
exports.default = scrapController;
//# sourceMappingURL=scrapController.js.map