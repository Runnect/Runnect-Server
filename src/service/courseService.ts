import { PrismaClient } from "@prisma/client";
import { CourseCreateDTO } from './../interface/course/CourseCreateDTO';

const prisma = new PrismaClient();

//* 코스 그리기
const createCourse = async (courseCreateDTO: CourseCreateDTO) => {
    
    const temp = '[(23.11, 12.11), (22.11, 14.11)]'; // 
    // const data = await prisma.$queryRaw`INSERT INTO "Course" (user_machine_id, departure_region, departure_city, departure_town, departure_detail, distance, image, departure_name, path) VALUES(${courseCreateDTO.machineId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path})`;
    const data = await prisma.$queryRaw`INSERT INTO "Course" (user_machine_id, departure_region, departure_city, departure_town, departure_detail, distance, image, departure_name, path) VALUES(${courseCreateDTO.machineId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${temp}::path)`;
    return data;
};

const courseService = {
    createCourse,
};

export default courseService;