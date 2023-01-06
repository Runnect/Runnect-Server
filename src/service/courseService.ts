import { CourseDetailGetDTO } from './../interface/DTO/CourseDetailGetDTO';
import { Course, CourseGetDTO } from './../interface/DTO/CourseGetDTO';
import { PrivateCourse, PrivateCourseGetDTO } from './../interface/DTO/PrivateCourseGetDTO';
import { dateConvertString } from './../module/convert/convertTime';
import { PrismaClient } from "@prisma/client";
import { pathConvertCoor } from '../module/convert/pathConvertCoor';

const prisma = new PrismaClient();

const getCourseByUser = async (machineId: string) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                machine_id: machineId,
            },
        });
        if (!findUser) return "NO_USER";
        const result = await prisma.course.findMany({
            where: {
                user_machine_id: machineId,
            },
            orderBy: {
                created_at: "desc",
            },
        });
        console.log(result);

        if (!result) return null;
        const courses: Course[] = result.map((pc: any) => {
            let course: Course = {
                id: pc.id,
                image: pc.image,
                createdAt: dateConvertString(pc.created_at),
                departure: {
                    region: pc.departure_region,
                    city: pc.departure_city,
                },
            };
            return course;
        });

        const courseGetDTO: CourseGetDTO = {
            user: {
                machineId: machineId,
            },
            courses: courses,
        };
        return courseGetDTO;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getPrivateCourseByUser = async (machineId: string) => {
    try {
        const findUser = await prisma.user.findUnique({
            where: {
                machine_id: machineId,
            },
        });
        if (!findUser) return "NO_USER";
        const result = await prisma.course.findMany({
            where: {
                AND: [ {user_machine_id: machineId}, {private: true} ],
            },
            orderBy: {
                created_at: "desc",
            },
        });

        if (!result) return null;
        const privateCourses: PrivateCourse[] = result.map((pc: any) => {
            let privateCourse: PrivateCourse = {
                id: pc.id,
                image: pc.image,
                createdAt: dateConvertString(pc.created_at),
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

        const privateCourseGetDTO: PrivateCourseGetDTO = {
            user: {
                machineId: machineId,
            },
            privateCourses: privateCourses,
        };
        return privateCourseGetDTO;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getCourseDetail = async (machineId: string, courseId: number) => {
    try {
        const result: any = await prisma.$queryRaw`SELECT id, created_at, path::text, distance::text, departure_region, departure_city, departure_town, departure_name FROM "Course" WHERE id=${courseId}`;
        
        if (!result[0]) return null;

        const courseDetailGetDTO: CourseDetailGetDTO = {
            user: {
                machineId: machineId,
            },
            course: {
                id: courseId,
                createdAt: dateConvertString(result[0]['created_at']),
                path: pathConvertCoor(result[0]['path']),
                distance: result[0]['distance'] as number,
                departure: {
                    region: result[0]['departure_region'],
                    city: result[0]['departure_city'],
                    town: result[0]['departure_town'],
                    name: result[0]['departure_name']
                },
            },
        };
        return courseDetailGetDTO;
    } catch (error) {
        console.error(error);
        throw error;
    }

};

const courseService = {
    getCourseByUser,
    getPrivateCourseByUser,
    getCourseDetail,
};

export default courseService;