import { Course } from "./../interface/DTO/CourseGetDTO";
import { log } from "console";
import { PublicCourseCreateRequestDTO } from "./../interface/DTO/PublicCourseCreateDTO";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { ElasticInference } from "aws-sdk";

const prisma = new PrismaClient();

const createPublicCourse = async (publicCourseCreateRequestDTO: PublicCourseCreateRequestDTO) => {
  try {
    const publicCourseData = await prisma.publicCourse.create({
      data: {
        course_id: +(publicCourseCreateRequestDTO.courseId as string),
        title: publicCourseCreateRequestDTO.title,
        description: publicCourseCreateRequestDTO.description,
      },
    });

    if (!publicCourseData) return null;
    else {
      // create 성공시, courseId로 해당 코스 private를 false로 변경
      const courseData = await prisma.course.update({
        where: { id: publicCourseData.course_id },
        data: {
          private: false,
        },
      });

      return publicCourseData;
    }
  } catch (error) {
    //~ error 분기 처리 : db의 제약조건등을 위반시 생기는 에러
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        //~ 제약조건등을 위반 에러
        //이미 업로드한 코스
        return `해당 ${error.meta?.target}는 이미 업로드된 코스입니다.`;
      } else if (error.code === "P2003") {
        //~ fk 외래키제약조건실패
        //없는 코스
        return `${error.meta?.target}의 아이디가 유효하지 않습니다.`;
      }
    }
    //~ error 분기 처리 : db 칼럼의 데이터 타입을 지키지 않을때, null이 될수 없는 필드가 누락되었을때
    else if (error instanceof PrismaClientValidationError) {
      return `${error.message}`;
    }
    throw error;
  }
};

const getPublicCourseByUser = async (machineId: string) => {
  try {
    const courseData = await prisma.course.findMany({
      where: {
        AND: [{ user_machine_id: machineId }, { private: false }],
      },
      include: {
        PublicCourse: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    console.log(courseData);

    return courseData;
  } catch (error) {
    //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
    console.log(error);
    throw error;
  }
};

const getPublicCourseDetail = async (machineId: string, publicCourseId: number) => {
  try {
    const publicCourseData = await prisma.publicCourse.findUnique({
      where: {
        id: publicCourseId,
      },
      include: {
        Course: {
          include: {
            User: true,
          },
        },
        Scrap: {
          where: {
            AND: [{ user_machine_id: machineId }, { scrapTF: true }],
          },
        },
      },
    });

    console.log(publicCourseData);

    return publicCourseData;
  } catch (error) {
    //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
    console.log(error);
    throw error;
  }
};

const recommendPublicCourse = async (machineId: string) => {
  try {
    const data = await prisma.publicCourse.findMany({
      include: {
        _count: {
          select: { Scrap: true },
        },
        Course: true,
        Scrap: {
          where: {
            AND: [{ user_machine_id: machineId }, { scrapTF: true }],
          },
        },
      },
      orderBy: {
        Scrap: {
          _count: "desc",
        },
      },
    });
    console.log(data);

    return data;
  } catch (error) {
    //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
    console.log(error);
    throw error;
  }
};

const searchPublicCourse = async (machineId: string, keyword: string) => {
  try {
    const data = await prisma.publicCourse.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
            },
          },
          {
            Course: {
              departure_region: { contains: keyword },
            },
          },
          {
            Course: {
              departure_city: { contains: keyword },
            },
          },
          {
            Course: {
              departure_city: { contains: keyword },
            },
          },
          {
            Course: {
              departure_town: { contains: keyword },
            },
          },
          {
            Course: {
              departure_detail: { contains: keyword },
            },
          },
          {
            Course: {
              departure_name: { contains: keyword },
            },
          },
        ],
      },
      include: {
        Course: true,
        Scrap: {
          where: {
            AND: [{ user_machine_id: machineId }, { scrapTF: true }],
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    console.log(data);

    return data;
  } catch (error) {
    //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
    console.log(error);
    throw error;
  }
};

const publicCourseService = {
  createPublicCourse,
  getPublicCourseByUser,
  getPublicCourseDetail,
  recommendPublicCourse,
  searchPublicCourse,
};

export default publicCourseService;
