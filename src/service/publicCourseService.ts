import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createPublicCourse = async () => {};

const getPublicCourseByUser = async () => {};

const getPublicCourseDetail = async () => {};

const recomendPublicCourse = async () => {};

const searchPublicCourse = async () => {};

const publicCourseService = {
  createPublicCourse,
  getPublicCourseByUser,
  getPublicCourseDetail,
  recomendPublicCourse,
  searchPublicCourse,
};

export default publicCourseService;
