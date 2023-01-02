import { Request, Response } from "express";
import { publicCourseService } from "../service";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";

const createPublicCourse = async (req: Request, res: Response) => {
  const machineId = req.headers.machineId;
  if (machineId) {
    res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
  }

  const { courseId, title, discription } = req.body;

  try {
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getPublicCourseByUser = async (req: Request, res: Response) => {};

const getPublicCourseDetail = async (req: Request, res: Response) => {};

const recommendPublicCourse = async (req: Request, res: Response) => {};

const searchPublicCourse = async (req: Request, res: Response) => {};

const publicCourseController = {
  createPublicCourse,
  getPublicCourseByUser,
  getPublicCourseDetail,
  recommendPublicCourse,
  searchPublicCourse,
};

export default publicCourseController;
