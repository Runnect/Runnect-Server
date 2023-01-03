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

const getPublicCourseByUser = async () => {};

const getPublicCourseDetail = async () => {};

const recommendPublicCourse = async () => {};

const searchPublicCourse = async () => {};

const publicCourseService = {
  createPublicCourse,
  getPublicCourseByUser,
  getPublicCourseDetail,
  recommendPublicCourse,
  searchPublicCourse,
};

export default publicCourseService;
