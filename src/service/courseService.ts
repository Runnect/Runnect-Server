import { Course, CourseGetDTO } from './../interface/DTO/CourseGetDTO';
import { dateConvertString } from './../module/convert/convertTime';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

const courseService = {
    getCourseByUser,
};

export default courseService;