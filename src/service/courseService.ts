import { PrismaClient } from "@prisma/client";
import { CourseCreateDTO } from './../interface/course/CourseCreateDTO';

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

const courseService = {
    createCourse,
};

export default courseService;