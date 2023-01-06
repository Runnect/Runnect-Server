import { validationResult } from 'express-validator';
import { success, fail } from './../constant/response';
import { Request, Response } from "express";
import { rm, sc } from '../constant';
import { courseService } from '../service';
import { requestConvertDeparture } from '../module/convert/requestConvertDeparture';

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
 * @access 
 */
const getPrivateCourseByUser = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));

    const machineId = req.header("machineId") as string;
    try {
        const data = await courseService.getPrivateCourseByUser(machineId);
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
 * @access 
 */
const getCourseDetail = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) { 
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
    }

    const machineId = req.header("machineId") as string;
    const { courseId } = req.params;

    try {
        const data = await courseService.getCourseDetail(machineId, +courseId);
        if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_COURSE));
        return res.status(sc.OK).send(success(sc.OK, rm.READ_COURSE_SUCCESS, data));
        
    } catch (e) {
        console.error(e);
        res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};


const courseController = {
    getCourseByUser,
    getPrivateCourseByUser,
    getCourseDetail,
};

export default courseController;