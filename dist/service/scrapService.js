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
const createScrap = (scrapDTO) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const scrapId = yield prisma.scrap.findFirst({
            where: {
                user_id: scrapDTO.userId,
                public_course_id: scrapDTO.publicCourseId,
            },
            select: {
                id: true,
            },
        });
        if (scrapId) {
            // 이미 이전에 해당 유저가 해당 퍼블릭 코스를 스크랩한적이 있는경우
            const updateScrap = yield prisma.scrap.update({
                where: { id: scrapId["id"] },
                data: { scrapTF: true },
            });
            return updateScrap;
        }
        else {
            // 이미 이전에 해당 유저가 해당 퍼블릭 코스를 스크랩한적이 없는경우
            const addScrap = yield prisma.scrap.create({
                data: {
                    user_id: scrapDTO.userId,
                    public_course_id: scrapDTO.publicCourseId,
                },
            });
            if (!addScrap) {
                return null;
            }
            else {
                // User: createdScrap + 1
                yield prisma.user.update({
                    where: {
                        id: scrapDTO.userId,
                    },
                    data: {
                        created_scrap: { increment: 1 },
                    },
                });
                yield service_1.stampService.createStampByUser(scrapDTO.userId, "s"); //처음 스크랩한것이기 때문에 스탬프검사하기
                return addScrap;
            }
        }
    }
    catch (error) {
        //~ error 분기 처리 : db의 제약조건등을 위반시 생기는 에러
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                //~ fk 외래키제약조건실패
                //없는 코스또는 없는 유저
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
const deleteScrap = (scrapDTO) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteScrap = yield prisma.scrap.updateMany({
            where: {
                user_id: scrapDTO.userId,
                public_course_id: scrapDTO.publicCourseId,
            },
            data: { scrapTF: false },
        });
        return deleteScrap;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const getScrapCourseByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scrapCourseData = yield prisma.scrap.findMany({
            where: {
                AND: [{ user_id: userId }, { scrapTF: true }],
            },
            include: {
                PublicCourse: {
                    include: {
                        Course: true,
                    },
                },
            },
        });
        return scrapCourseData;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const scrapService = { createScrap, deleteScrap, getScrapCourseByUser };
exports.default = scrapService;
//# sourceMappingURL=scrapService.js.map