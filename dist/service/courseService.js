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
const convertTime_1 = require("./../module/convert/convertTime");
const client_1 = require("@prisma/client");
const pathConvertCoor_1 = require("../module/convert/pathConvertCoor");
const service_1 = require("../service");
const constant_1 = require("../constant");
const prisma = new client_1.PrismaClient();
//* 코스 그리기
const createCourse = (courseCreateDTO) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (courseCreateDTO.detail || courseCreateDTO.name) {
            //출발지 디테일과 건물이름 둘다 존재시
            const k = yield prisma.$queryRaw `INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, departure_detail, distance, image, departure_name, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path}::path)`;
        }
        else if (courseCreateDTO.detail) {
            //출발지 디테일은 존재안하고 건물이름만 존재시
            const k = yield prisma.$queryRaw `INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, departure_detail, distance, image, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.path}::path)`;
        }
        else if (courseCreateDTO.name) {
            //출발지 디테일은 존재하고 건물이름만 존재안할때
            const k = yield prisma.$queryRaw `INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, distance, image, departure_name, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town},  ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path}::path)`;
        }
        else {
            //출발지 디테일과 건물이름 둘다 존재안할때
            const k = yield prisma.$queryRaw `INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town,  distance, image,  path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town},  ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.path}::path)`;
        }
        const result = yield prisma.course.findFirst({
            orderBy: {
                created_at: "desc",
            },
        });
        // User: createdCourse + 1
        yield prisma.user.update({
            where: {
                id: courseCreateDTO.userId,
            },
            data: {
                created_course: { increment: 1 },
            },
        });
        yield service_1.stampService.createStampByUser(courseCreateDTO.userId, "c");
        const createdCourse = { course: { id: result === null || result === void 0 ? void 0 : result.id, createdAt: (0, convertTime_1.dateConvertString)(result === null || result === void 0 ? void 0 : result.created_at) } };
        return createdCourse;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const getCourseByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 현재 유저가 우리 회원인지는 auth 미들웨어에서 검사함
        const result = yield prisma.course.findMany({
            where: {
                user_id: userId,
                deleted_at: null,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        if (!result)
            return null;
        const courses = result.map((pc) => {
            let course = {
                id: pc.id,
                image: pc.image,
                createdAt: (0, convertTime_1.dateConvertString)(pc.created_at),
                departure: {
                    region: pc.departure_region,
                    city: pc.departure_city,
                },
            };
            return course;
        });
        const courseGetDTO = {
            user: {
                id: userId,
            },
            courses: courses,
        };
        return courseGetDTO;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const getPrivateCourseByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 현재 유저가 우리 회원인지는 auth 미들웨어에서 검사함
        const result = yield prisma.course.findMany({
            where: {
                AND: [{ user_id: userId }, { private: true }, { deleted_at: null }],
            },
            orderBy: {
                created_at: "desc",
            },
        });
        if (!result)
            return null;
        const privateCourses = result.map((pc) => {
            let privateCourse = {
                id: pc.id,
                image: pc.image,
                createdAt: (0, convertTime_1.dateConvertString)(pc.created_at),
                distance: pc.distance,
                departure: {
                    region: pc.departure_region,
                    city: pc.departure_city,
                    town: pc.departure_town,
                    name: pc.departure_name,
                },
            };
            return privateCourse;
        });
        const privateCourseGetDTO = {
            user: {
                id: userId,
            },
            privateCourses: privateCourses,
        };
        return privateCourseGetDTO;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const getCourseDetail = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.$queryRaw `SELECT id, created_at, path::text, distance::text, departure_region, departure_city, departure_town, departure_name, image FROM "Course" WHERE id=${courseId} AND deleted_at IS NULL`;
        if (!result[0])
            return null;
        const courseDetailGetDTO = {
            user: {
                id: userId,
            },
            course: {
                id: courseId,
                createdAt: (0, convertTime_1.dateConvertString)(result[0]["created_at"]),
                path: (0, pathConvertCoor_1.pathConvertCoor)(result[0]["path"]),
                distance: Number(result[0]["distance"]),
                image: result[0]["image"],
                departure: {
                    region: result[0]["departure_region"],
                    city: result[0]["departure_city"],
                    town: result[0]["departure_town"],
                    name: result[0]["departure_name"],
                },
            },
        };
        return courseDetailGetDTO;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const deleteCourse = (courseIdList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //1. 코스삭제 -> deleteAt 업데이트
        //2. update한 코스들에 연결된  publicCourse 삭제
        const deletedCourse = yield prisma.course.updateMany({
            where: {
                id: {
                    in: courseIdList,
                },
            },
            data: {
                deleted_at: new Date(),
            },
        });
        //!
        console.log("업데이트된 코스");
        console.log(deletedCourse);
        /**
         * const result = await prisma.course.findMany({
          where: {
            AND: [{ user_id: userId }, { private: true }, { deleted_at: null }],
          },
          orderBy: {
            created_at: "desc",
          },
        });
         */
        const deletedPublicCourseData = yield prisma.course.findMany({
            where: {
                AND: [{ id: { in: courseIdList } }, { private: false }],
            },
            include: {
                PublicCourse: true,
            },
        });
        //!
        console.log("삭제할 퍼블릭코스들");
        console.log(deletedPublicCourseData);
        const deletedPublicCourseIdList = new Array;
        deletedPublicCourseData.forEach((pc) => {
            var _a;
            deletedPublicCourseIdList.push((_a = pc.PublicCourse) === null || _a === void 0 ? void 0 : _a.id);
        });
        //!
        console.log("삭제할 퍼블릭코스아이디들");
        console.log(deletedPublicCourseIdList);
        const deletedPublicCourse = yield service_1.publicCourseService.deletePublicCourse(deletedPublicCourseIdList);
        if (deletedCourse.count === 0 || deletedCourse.count != courseIdList.length) {
            return constant_1.rm.NO_DELETED_COURSE;
        }
        return deletedCourse.count;
    }
    catch (error) {
        //updateMany 메소드는 없는 코스를 삭제할때 count가 0으로만 나오지 에러가 나오지는 않음.
        console.log(error);
    }
});
const courseService = {
    createCourse,
    getCourseByUser,
    getPrivateCourseByUser,
    getCourseDetail,
    deleteCourse,
};
exports.default = courseService;
//# sourceMappingURL=courseService.js.map