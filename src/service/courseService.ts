import { CourseDetailGetDTO } from "../interface/DTO/course/CourseDetailGetDTO";
import { Course, CourseGetDTO } from "../interface/DTO/course/CourseGetDTO";
import { PrivateCourse, PrivateCourseGetDTO } from "../interface/DTO/course/PrivateCourseGetDTO";
import { CourseCreateDTO } from "../interface/DTO/course/CourseCreateDTO";
import { dateConvertString } from "./../module/convert/convertTime";
import { PrismaClient } from "@prisma/client";
import { pathConvertCoor } from "../module/convert/pathConvertCoor";
import { publicCourseService, stampService } from "../service";
import { rm } from "../constant";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const prisma = new PrismaClient();

//* 코스 그리기
const createCourse = async (courseCreateDTO: CourseCreateDTO) => {
  try {
    if (courseCreateDTO.detail || courseCreateDTO.name) {
      //출발지 디테일과 건물이름 둘다 존재시
      const k = await prisma.$queryRaw`INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, departure_detail, distance, image, departure_name, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}::real, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path}::path)`;
    } else if (courseCreateDTO.detail) {
      //출발지 디테일은 존재안하고 건물이름만 존재시
      const k = await prisma.$queryRaw`INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, departure_detail, distance, image, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town}, ${courseCreateDTO.detail}, ${courseCreateDTO.distance}::real, ${courseCreateDTO.image}, ${courseCreateDTO.path}::path)`;
    } else if (courseCreateDTO.name) {
      //출발지 디테일은 존재하고 건물이름만 존재안할때
      const k = await prisma.$queryRaw`INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town, distance, image, departure_name, path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town},  ${courseCreateDTO.distance}::real, ${courseCreateDTO.image}, ${courseCreateDTO.name}, ${courseCreateDTO.path}::path)`;
    } else {
      //출발지 디테일과 건물이름 둘다 존재안할때
      const k = await prisma.$queryRaw`INSERT INTO "Course" (user_id, departure_region, departure_city, departure_town,  distance, image,  path) VALUES(${courseCreateDTO.userId}, ${courseCreateDTO.region}, ${courseCreateDTO.city}, ${courseCreateDTO.town},  ${courseCreateDTO.distance}::real, ${courseCreateDTO.image}, ${courseCreateDTO.path}::path)`;
    }

    const result = await prisma.course.findFirst({
      orderBy: {
        created_at: "desc",
      },
    });
    // User: createdCourse + 1
    await prisma.user.update({
      where: {
        id: courseCreateDTO.userId,
      }, 
      data: {
        created_course: {increment : 1},
      },
    });
    await stampService.createStampByUser(courseCreateDTO.userId, "c");

    const createdCourse = { course: { id: result?.id, createdAt: dateConvertString(result?.created_at) } };
    return createdCourse;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && (error.code == "22P03" || error.code === "P2010")) {
      console.log(error);
      console.log(courseCreateDTO);
    } else {
      console.log(error);
    }
    throw error;
  }
};

const getCourseByUser = async (userId: number) => {
  try {
    // 현재 유저가 우리 회원인지는 auth 미들웨어에서 검사함

    const result = await prisma.course.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
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
    // 현재 유저가 우리 회원인지는 auth 미들웨어에서 검사함

    const result = await prisma.course.findMany({
      where: {
        AND: [{ user_id: userId }, { private: true }, { deleted_at: null }],
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
    const result: any = await prisma.$queryRaw`SELECT id, created_at, path::text, distance::text, departure_region, departure_city, departure_town, departure_name, image FROM "Course" WHERE id=${courseId} AND deleted_at IS NULL`;

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

const deleteCourse = async (courseIdList: Array<number>) => {
  try {
    //1. 코스삭제 -> deleteAt 업데이트
    //2. update한 코스들에 연결된  publicCourse 삭제

    const deletedCourse = await prisma.course.updateMany({
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
    const deletedPublicCourseData = await prisma.course.findMany({
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

    const deletedPublicCourseIdList : Array<number> = new Array<number>;
    deletedPublicCourseData.forEach((pc)=>{
      deletedPublicCourseIdList.push(pc.PublicCourse?.id as number);
    });
    //!
    console.log("삭제할 퍼블릭코스아이디들");
    console.log(deletedPublicCourseIdList);
    const deletedPublicCourse = await publicCourseService.deletePublicCourse(deletedPublicCourseIdList);

    if (deletedCourse.count === 0 || deletedCourse.count != courseIdList.length) {
      return rm.NO_DELETED_COURSE;
    }
    return deletedCourse.count;
  } catch (error) {
    //updateMany 메소드는 없는 코스를 삭제할때 count가 0으로만 나오지 에러가 나오지는 않음.

    console.log(error);
  }
};

const courseService = {
  createCourse,
  getCourseByUser,
  getPrivateCourseByUser,
  getCourseDetail,
  deleteCourse,
};

export default courseService;
