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
const checkScrap_1 = require("../module/check/checkScrap");
const pathConvertCoor_1 = require("../module/convert/pathConvertCoor");
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
            if (courseData.user_id) {
                // User: createdPublicCourse + 1
                yield prisma.user.update({
                    where: {
                        id: courseData.user_id,
                    },
                    data: {
                        created_public_course: { increment: 1 },
                    },
                });
                yield service_1.stampService.createStampByUser(courseData.user_id, "u");
            }
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
const getPublicCourseByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseData = yield prisma.course.findMany({
            where: {
                AND: [{ user_id: userId }, { private: false }],
            },
            include: {
                PublicCourse: true,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        return courseData;
    }
    catch (error) {
        //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
        console.log(error);
        throw error;
    }
});
const getPublicCourseDetail = (userId, publicCourseId) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        /** path정보를 가져오지 않은 prisma orm 사용 코드
        const publicCourseData = await prisma.publicCourse.findUnique({
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
                AND: [{ user_id: userId }, { scrapTF: true }],
              },
            },
          },
        });
    
        return publicCourseData;
    
        */
        const publicCourseData = yield prisma.$queryRaw `
        SELECT "PublicCourse"."id" AS "pid","PublicCourse"."title","PublicCourse"."description",
         "Course"."id" AS "cid", "Course"."path"::text,"Course"."image","Course"."distance"::text,"Course"."departure_region","Course"."departure_city","Course"."departure_town","Course"."departure_name", 
         "User"."nickname", "User"."id" AS "pcuid", "User"."level", "User"."latest_stamp"
         FROM "PublicCourse", "Course" LEFT JOIN "User" ON "Course"."user_id"="User"."id"
         WHERE "PublicCourse"."id"=${publicCourseId}  AND "PublicCourse"."course_id" = "Course"."id"`;
        //!
        console.log(publicCourseData);
        if (!publicCourseData || publicCourseData.length == 0) {
            return publicCourseData;
        }
        const isPublicScrap = yield prisma.scrap.findFirst({
            where: { user_id: userId, public_course_id: publicCourseId, scrapTF: true },
        });
        //!
        console.log(isPublicScrap);
        if (((_c = publicCourseData[0]) === null || _c === void 0 ? void 0 : _c.pcuid) == null || ((_d = publicCourseData[0]) === null || _d === void 0 ? void 0 : _d.pcuid) == undefined) {
            publicCourseData[0].nickname = "알 수 없음";
            publicCourseData[0].level = "알 수 없음";
            publicCourseData[0].latest_stamp = "알 수 없음";
        }
        const publicCourseDetailGetDTO = {
            user: {
                nickname: publicCourseData[0].nickname,
                level: publicCourseData[0].level + "",
                image: publicCourseData[0].latest_stamp,
                isNowUser: publicCourseData[0].pcuid == userId ? true : false,
            },
            publicCourse: {
                id: publicCourseData[0].pid,
                courseId: publicCourseData[0].cid,
                scrap: (0, checkScrap_1.checkScrap)(isPublicScrap),
                image: publicCourseData[0].image,
                title: publicCourseData[0].title,
                description: publicCourseData[0].description,
                path: (0, pathConvertCoor_1.pathConvertCoor)(publicCourseData[0].path),
                distance: +publicCourseData[0].distance,
                departure: {
                    region: publicCourseData[0].departure_region,
                    city: publicCourseData[0].departure_city,
                    town: publicCourseData[0].departure_town,
                    name: publicCourseData[0].departure_name,
                },
            },
        };
        return publicCourseDetailGetDTO;
    }
    catch (error) {
        //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
        console.log(error);
        throw error;
    }
});
const recommendPublicCourse = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.publicCourse.findMany({
            include: {
                _count: {
                    select: { Scrap: true },
                },
                Course: true,
                Scrap: {
                    where: {
                        AND: [{ user_id: userId }, { scrapTF: true }],
                    },
                },
            },
            orderBy: {
                Scrap: {
                    _count: "desc",
                },
            },
        });
        return data;
    }
    catch (error) {
        //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
        console.log(error);
        throw error;
    }
});
const searchPublicCourse = (userId, keyword) => __awaiter(void 0, void 0, void 0, function* () {
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
                        AND: [{ user_id: userId }, { scrapTF: true }],
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });
        return data;
    }
    catch (error) {
        //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
        console.log(error);
        throw error;
    }
});
const updatePublicCourse = (publicCourseId, UpdatePublicCourseDTO) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = yield prisma.publicCourse.update({
            where: {
                id: publicCourseId,
            },
            data: {
                title: UpdatePublicCourseDTO.title,
                description: UpdatePublicCourseDTO.description,
            },
        });
        return updateData;
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError && error.code === "P2025") {
            return null;
        }
        else {
            console.log(error);
        }
    }
});
const deletePublicCourse = (publicCourseIdList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // publicCourseIdList를 사용하여 courseIdList를 만듦
        const getCourseId = yield prisma.publicCourse.findMany({
            where: {
                id: {
                    in: publicCourseIdList,
                },
            },
            select: {
                id: true,
                course_id: true,
            },
        });
        const publicCourseIdListForChk = new Array();
        const courseIdList = new Array();
        for (let i = 0; i < getCourseId.length; i++) {
            courseIdList.push(getCourseId[i]["course_id"]);
            publicCourseIdListForChk.push(getCourseId[i]["id"]);
        }
        // 에러 처리
        const errorIdList = publicCourseIdList.filter((x) => !publicCourseIdListForChk.includes(x));
        if (errorIdList.length != 0)
            return `유효하지 않은 publicCourseId가 존재합니다 : ${errorIdList.toString()}`;
        // publicCourse 삭제
        const data = yield prisma.publicCourse.deleteMany({
            where: {
                id: {
                    in: publicCourseIdList,
                },
            },
        });
        // course -> private: true로 업데이트
        const updatedPublicCourse = yield prisma.course.updateMany({
            where: {
                id: {
                    in: courseIdList,
                },
            },
            data: {
                private: true,
            },
        });
        //!
        console.log("퍼블릭 코스삭제후 private true로 업데이트한 코스들");
        console.log(updatedPublicCourse);
        return data.count;
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError && error.code === "P2025") {
            return `존재하지 않는 코스 업로드입니다.`;
        }
        else {
            console.log(error);
        }
        throw error;
    }
});
const publicCourseService = {
    createPublicCourse,
    getPublicCourseByUser,
    getPublicCourseDetail,
    recommendPublicCourse,
    searchPublicCourse,
    updatePublicCourse,
    deletePublicCourse,
};
exports.default = publicCourseService;
//# sourceMappingURL=publicCourseService.js.map