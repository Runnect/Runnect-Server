import { validationResult } from 'express-validator';
import { success, fail } from './../constant/response';
import { Request, Response } from "express";
import { rm, sc } from '../constant';
import { courseService } from '../service';
import { requestConvertDeparture } from '../module/convert/requestConvertDeparture';
import { CourseCreateDTO } from './../interface/course/CourseCreateDTO';


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

    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const { location } = image;

    const departureObject = requestConvertDeparture(req.body.departureAddress, req.body.departureName);
    const courseCreateDTO: CourseCreateDTO = {machineId: req.header("machineId") as string, path: req.body.path, distance: Number(req.body.distance), region: departureObject.region, city: departureObject.city, town: departureObject.town, detail: departureObject.detail, name: departureObject.name, image: location};

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
 * @access 
 */
const getCourseByUser = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));

    const machineId = req.header("machineId") as string;
    try {
        const data = await courseService.getCourseByUser(machineId);
        return res.status(sc.OK).send(success(sc.OK, rm.READ_COURSE_SUCCESS, data));
    } catch (error) {
        console.error(error);
        res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

/**
 * @route  GET/course/private/user
 * @desc 내가 그린 코스 조회 (업로드 미포함)
 * @access 
 */
const getPrivateCourseByUser = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));

    const machineId = req.header("machineId") as string;
    try {
        const data = await courseService.getPrivateCourseByUser(machineId);
        return res.status(sc.OK).send(success(sc.OK, rm.READ_PRIVATE_COURSE_SUCCESS, data));
    } catch (error) {
        console.error(error);
        res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

const courseController = {
    getCourseByUser,
    getPrivateCourseByUser,
    createCourse,
};

export default courseController;