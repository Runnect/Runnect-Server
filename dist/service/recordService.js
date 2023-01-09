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
const client_1 = require("@prisma/client");
const service_1 = require("../service");
const runtime_1 = require("@prisma/client/runtime");
const prisma = new client_1.PrismaClient();
const createRecord = (recordRequestDTO) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const recordData = yield prisma.record.create({
            data: {
                user_machine_id: recordRequestDTO.machineId,
                course_id: +recordRequestDTO.courseId,
                public_course_id: recordRequestDTO.publicCourseId,
                title: recordRequestDTO.title,
                pace: recordRequestDTO.pace,
                time: recordRequestDTO.time,
            },
        });
        if (!recordData) {
            return null;
        }
        else {
            yield service_1.stampService.createStampByUser(recordRequestDTO.machineId, "r");
            return recordData;
        }
    }
    catch (error) {
        //~ error 분기 처리 : db의 제약조건등을 위반시 생기는 에러
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            if (error.code === "P2009") {
                //~ 쿼리 유효성 검사 실패
                //db 필드에 맞는 input 값이 아님
                return `pace또는 time이 올바른 input 형식이 아닙니다.`;
            }
            else if (error.code === "P2003") {
                //~ fk 외래키제약조건실패
                //없는 코스
                return `${(_a = error.meta) === null || _a === void 0 ? void 0 : _a.field_name}의 아이디가 유효하지 않습니다.`;
            }
        }
        //~ error 분기 처리 : db 칼럼의 데이터 타입을 지키지 않을때, null이 될수 없는 필드가 누락되었을때
        else if (error instanceof runtime_1.PrismaClientValidationError) {
            return `${error.message}`;
        }
        throw error;
    }
});
const getRecordByUser = (machineId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield prisma.user.findUnique({
            where: { machine_id: machineId },
        });
        if (!userData) {
            return null;
        }
        else {
            const recordData = yield prisma.record.findMany({
                where: { user_machine_id: machineId },
                include: {
                    Course: {
                        include: {
                            User: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "desc", // 최신순이니까 desc
                },
            });
            if (!recordData) {
                return [];
            }
            else {
                return recordData;
            }
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const recordService = { createRecord, getRecordByUser };
exports.default = recordService;
//# sourceMappingURL=recordService.js.map