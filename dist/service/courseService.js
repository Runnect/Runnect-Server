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
        yield service_1.stampService.createStampByUser(courseCreateDTO.userId, "c");
        const createdCourse = { course: { id: result === null || result === void 0 ? void 0 : result.id, createdAt: result === null || result === void 0 ? void 0 : result.created_at } };
        return createdCourse;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const getCourseByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findUser = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!findUser)
            return "NO_USER";
        const result = yield prisma.course.findMany({
            where: {
                user_id: userId,
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
        const findUser = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!findUser)
            return "NO_USER";
        const result = yield prisma.course.findMany({
            where: {
                AND: [{ user_id: userId }, { private: true }],
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
        const result = yield prisma.$queryRaw `SELECT id, created_at, path::text, distance::text, departure_region, departure_city, departure_town, departure_name, image FROM "Course" WHERE id=${courseId}`;
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
const courseService = {
    createCourse,
    getCourseByUser,
    getPrivateCourseByUser,
    getCourseDetail,
};
exports.default = courseService;
//# sourceMappingURL=courseService.js.map