import { PrismaClient } from "@prisma/client";
import { CourseCreateDTO } from './../interface/course/CourseCreateDTO';

const prisma = new PrismaClient();

//* 코스 그리기
const createCourse = async (courseCreateDTO: CourseCreateDTO) => {

    // const data = await prisma.course.create({
    //     data: {
    //         user_machine_id: machineId,
    //         departure_region: departures[0],
    //         departure_city: departures[1],
    //         departure_town: departures[2],
    //         departure_detail: departures[3],
    //         distance: courseCreateDTO.distance,
    //         image: location,
    //         departure_name: courseCreateDTO.departureName,
    //         path: courseCreateDTO.path,
    //     }
    // });
    const data = await prisma.$queryRaw`INSERT INTO "Course" (user_machine_id, departure_region, departure_city, departure_town, departure_detail, distance, image, departure_name, path) VALUES(${courseCreateDTO.machineId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path})`;
    return data;
};

const courseService = {
    createCourse,
};

export default courseService;