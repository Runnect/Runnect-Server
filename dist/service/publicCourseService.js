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
const runtime_1 = require("@prisma/client/runtime");
const service_1 = require("../service");
const prisma = new client_1.PrismaClient();
const createPublicCourse = (publicCourseCreateRequestDTO) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const publicCourseData = yield prisma.publicCourse.create({
            data: {
                course_id: +publicCourseCreateRequestDTO.courseId,
                title: publicCourseCreateRequestDTO.title,
                description: publicCourseCreateRequestDTO.description,
            },
        });
        if (!publicCourseData)
            return null;
        else {
            // create 성공시, courseId로 해당 코스 private를 false로 변경
            const courseData = yield prisma.course.update({
                where: { id: publicCourseData.course_id },
                data: {
                    private: false,
                },
            });
            yield service_1.stampService.createStampByUser(courseData.user_machine_id, "u");
            return publicCourseData;
        }
    }
    catch (error) {
        //~ error 분기 처리 : db의 제약조건등을 위반시 생기는 에러
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                //~ 제약조건등을 위반 에러
                //이미 업로드한 코스
                return `해당 ${(_a = error.meta) === null || _a === void 0 ? void 0 : _a.target}는 이미 업로드된 코스입니다.`;
            }
            else if (error.code === "P2003") {
                //~ fk 외래키제약조건실패
                //없는 코스
                return `${(_b = error.meta) === null || _b === void 0 ? void 0 : _b.field_name}의 아이디가 유효하지 않습니다.`;
            }
        }
        //~ error 분기 처리 : db 칼럼의 데이터 타입을 지키지 않을때, null이 될수 없는 필드가 누락되었을때
        else if (error instanceof runtime_1.PrismaClientValidationError) {
            return `${error.message}`;
        }
        throw error;
    }
});
const getPublicCourseByUser = (machineId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseData = yield prisma.course.findMany({
            where: {
                AND: [{ user_machine_id: machineId }, { private: false }],
            },
            include: {
                PublicCourse: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        console.log(courseData);
        return courseData;
    }
    catch (error) {
        //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
        console.log(error);
        throw error;
    }
});
const getPublicCourseDetail = (machineId, publicCourseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const publicCourseData = yield prisma.publicCourse.findUnique({
            where: {
                id: publicCourseId,
            },
            include: {
                Course: {
                    include: {
                        User: true,
                    },
                },
                Scrap: {
                    where: {
                        AND: [{ user_machine_id: machineId }, { scrapTF: true }],
                    },
                },
            },
        });
        console.log(publicCourseData);
        return publicCourseData;
    }
    catch (error) {
        //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
        console.log(error);
        throw error;
    }
});
const recommendPublicCourse = (machineId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.publicCourse.findMany({
            include: {
                _count: {
                    select: { Scrap: true },
                },
                Course: true,
                Scrap: {
                    where: {
                        AND: [{ user_machine_id: machineId }, { scrapTF: true }],
                    },
                },
            },
            orderBy: {
                Scrap: {
                    _count: "desc",
                },
            },
        });
        console.log(data);
        return data;
    }
    catch (error) {
        //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
        console.log(error);
        throw error;
    }
});
const searchPublicCourse = (machineId, keyword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.publicCourse.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: keyword,
                        },
                    },
                    {
                        Course: {
                            departure_region: { contains: keyword },
                        },
                    },
                    {
                        Course: {
                            departure_city: { contains: keyword },
                        },
                    },
                    {
                        Course: {
                            departure_city: { contains: keyword },
                        },
                    },
                    {
                        Course: {
                            departure_town: { contains: keyword },
                        },
                    },
                    {
                        Course: {
                            departure_detail: { contains: keyword },
                        },
                    },
                    {
                        Course: {
                            departure_name: { contains: keyword },
                        },
                    },
                ],
            },
            include: {
                Course: true,
                Scrap: {
                    where: {
                        AND: [{ user_machine_id: machineId }, { scrapTF: true }],
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });
        console.log(data);
        return data;
    }
    catch (error) {
        //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
        console.log(error);
        throw error;
    }
});
const publicCourseService = {
    createPublicCourse,
    getPublicCourseByUser,
    getPublicCourseDetail,
    recommendPublicCourse,
    searchPublicCourse,
};
exports.default = publicCourseService;
//# sourceMappingURL=publicCourseService.js.map