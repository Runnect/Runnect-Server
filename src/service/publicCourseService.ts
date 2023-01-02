import { PublicCourseCreateRequestDTO } from "./../interface/DTO/PublicCourseCreateDTO";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createPublicCourse = async (publicCourseCreateRequestDTO: PublicCourseCreateRequestDTO) => {
  try {
    const publicCourseData = await prisma.publicCourse.create({
      data: {
        course_id: +publicCourseCreateRequestDTO.courseId,
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

      console.log(courseData);
      return publicCourseData;
    }
  } catch (error) {
    console.log(error);
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
