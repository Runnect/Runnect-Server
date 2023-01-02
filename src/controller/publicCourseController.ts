import { Request, Response } from "express";
import { publicCourseService } from "../service";
import { rm, sc } from "../constant";
import { success,fail } from "../constant/response";

const createPublicCourse = async (req: Request, res: Response) => {
  const machineId = req.headers.machineId;

  if(machineId){
    res.
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
