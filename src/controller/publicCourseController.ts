import { Request, Response } from "express";
import { publicCourseService } from "../service";

const createPublicCourse = async (req: Request, res: Response) => {};

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
