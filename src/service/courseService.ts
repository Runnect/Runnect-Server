import { Course, CourseGetDTO } from './../interface/DTO/CourseGetDTO';
import { PrivateCourse, PrivateCourseGetDTO } from './../interface/DTO/PrivateCourseGetDTO';
import { CourseCreateDTO } from './../interface/course/CourseCreateDTO';
import { dateConvertString } from './../module/convert/convertTime';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//* 코스 그리기
const createCourse = async (courseCreateDTO: CourseCreateDTO) => {
    
    const temp = '[(23.11, 12.11), (22.11, 14.11)]'; // 
    // await prisma.$queryRaw`INSERT INTO "Course" (user_machine_id, departure_region, departure_city, departure_town, departure_detail, distance, image, departure_name, path) VALUES(${courseCreateDTO.machineId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path}::path)`;
    await prisma.$queryRaw`INSERT INTO "Course" (user_machine_id, departure_region, departure_city, departure_town, departure_detail, distance, image, departure_name, path) VALUES(${courseCreateDTO.machineId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${temp}::path)`;

    const result = await prisma.course.findFirst({
        orderBy:{
            created_at: "desc"
        }
    });

    const createdCourse = { "course" : { "id": result?.id, "createdAt": result?.created_at} };
    return createdCourse;
};

const getCourseByUser = async (machineId: string) => {
    try {
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

const courseService = {
    getCourseByUser,
    getPrivateCourseByUser,
    createCourse,
};

export default courseService;