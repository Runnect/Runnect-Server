import { CourseDetailGetDTO } from "../interface/DTO/course/CourseDetailGetDTO";
import { Course, CourseGetDTO } from "../interface/DTO/course/CourseGetDTO";
import { PrivateCourse, PrivateCourseGetDTO } from "../interface/DTO/course/PrivateCourseGetDTO";
import { CourseCreateDTO } from "../interface/DTO/course/CourseCreateDTO";
import { dateConvertString } from "./../module/convert/convertTime";
import { PrismaClient } from "@prisma/client";
import { pathConvertCoor } from "../module/convert/pathConvertCoor";
import { stampService } from "../service";

const prisma = new PrismaClient();

//* 코스 그리기
const createCourse = async (courseCreateDTO: CourseCreateDTO) => {
  try {
    if (courseCreateDTO.detail || courseCreateDTO.name) {
      //출발지 디테일과 건물이름 둘다 존재시
      const k = await prisma.$queryRaw`INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, departure_detail, distance, image, departure_name, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path}::path)`;
    } else if (courseCreateDTO.detail) {
      //출발지 디테일은 존재안하고 건물이름만 존재시
      const k = await prisma.$queryRaw`INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, departure_detail, distance, image, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.path}::path)`;
    } else if (courseCreateDTO.name) {
      //출발지 디테일은 존재하고 건물이름만 존재안할때
      const k = await prisma.$queryRaw`INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, distance, image, departure_name, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town},  ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path}::path)`;
    } else {
      //출발지 디테일과 건물이름 둘다 존재안할때
      const k = await prisma.$queryRaw`INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town,  distance, image,  path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town},  ${courseCreateDTO.distance}, ${courseCreateDTO.image}, ${courseCreateDTO.path}::path)`;
    }

    const result = await prisma.course.findFirst({
      orderBy: {
        created_at: "desc",
      },
    });

    await stampService.createStampByUser(courseCreateDTO.userId, "c");

    const createdCourse = { course: { id: result?.id, createdAt: dateConvertString(result?.created_at) } };
    return createdCourse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getCourseByUser = async (userId: number) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!findUser) return "NO_USER";
    const result = await prisma.course.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

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
        id: userId,
      },
      courses: courses,
    };
    return courseGetDTO;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getPrivateCourseByUser = async (userId: number) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!findUser) return "NO_USER";
    const result = await prisma.course.findMany({
      where: {
        AND: [{ user_id: userId }, { private: true }],
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
        id: userId,
      },
      privateCourses: privateCourses,
    };
    return privateCourseGetDTO;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getCourseDetail = async (userId: number, courseId: number) => {
  try {
    const result: any = await prisma.$queryRaw`SELECT id, created_at, path::text, distance::text, departure_region, departure_city, departure_town, departure_name, image FROM "Course" WHERE id=${courseId}`;

    if (!result[0]) return null;

    const courseDetailGetDTO: CourseDetailGetDTO = {
      user: {
        id: userId,
      },
      course: {
        id: courseId,
        createdAt: dateConvertString(result[0]["created_at"]),
        path: pathConvertCoor(result[0]["path"]),
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
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const courseService = {
  createCourse,
  getCourseByUser,
  getPrivateCourseByUser,
  getCourseDetail,
};

export default courseService;
