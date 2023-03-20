import { validationResult } from "express-validator";
import { success, fail } from "./../constant/response";
import { Request, Response } from "express";
import { rm, sc } from "../constant";
import { courseService } from "../service";
import { requestConvertDeparture } from "../module/convert/requestConvertDeparture";
import { CourseCreateDTO } from "../interface/DTO/course/CourseCreateDTO";
import { coorConvertPath } from "../module/convert/coorConverPath";

/**
 * @route  POST/course
 * @desc 경로 그리기
 */
const createCourse = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  console.log(req.body);
  const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
  if (!image) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_IMAGE));
  const { location } = image;

  const departureObject = requestConvertDeparture(req.body.departureAddress, req.body.departureName);
  if (!departureObject) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DEPARTURE_VALIDATION_ERROR));

  const courseCreateDTO: CourseCreateDTO = {
    userId: req.body.userId,
    path: coorConvertPath(req.body.path),
    distance: Number(req.body.distance),
    region: departureObject.region,
    city: departureObject.city,
    town: departureObject.town,
    detail: departureObject.detail,
    name: departureObject.name,
    image: location,
  };

  try {
    const data = await courseService.createCourse(courseCreateDTO);

    if (!data) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.CREATE_COURSE_FAIL));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.CREATE_COURSE_SUCCESS, data));
  } catch (e) {
    console.error(e);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

/**
 * @route  GET/course/user
 * @desc 내가 그린 코스 조회 (업로드 포함)
 */
const getCourseByUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));

  const userId = req.body.userId;
  try {
    const data = await courseService.getCourseByUser(userId);
    if (data == "NO_USER") return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
    return res.status(sc.OK).send(success(sc.OK, rm.READ_COURSE_SUCCESS, data));
  } catch (error) {
    console.error(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

/**
 * @route  GET/course/private/user
 * @desc 내가 그린 코스 조회 (업로드 미포함)
 */
const getPrivateCourseByUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));

  const userId = req.body.userId;
  try {
    const data = await courseService.getPrivateCourseByUser(userId);
    if (data == "NO_USER") return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
    return res.status(sc.OK).send(success(sc.OK, rm.READ_PRIVATE_COURSE_SUCCESS, data));
  } catch (error) {
    console.error(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

/**
 * @route  GET/course/detail/:courseId
 * @desc 내가 그린 코스 상세 페이지와 달리기 기능
 */
const getCourseDetail = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const userId = req.body.userId;
  const { courseId } = req.params;

  try {
    const data = await courseService.getCourseDetail(userId, +courseId);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_COURSE));
    return res.status(sc.OK).send(success(sc.OK, rm.READ_COURSE_SUCCESS, data));
  } catch (e) {
    console.error(e);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const courseController = {
  createCourse,
  getCourseByUser,
  getPrivateCourseByUser,
  getCourseDetail,
};

export default courseController;
