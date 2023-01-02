import { CourseCreateDTO } from './../interface/course/CourseCreateDTO';
import { validationResult } from 'express-validator';
import { success, fail } from './../constant/response';
import { Request, Response } from "express";
import { rm, sc } from '../constant';

/**
 * @route  POST/course
 * @desc 경로 그리기
 * @access 
 */
const createCourse = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    }

    const courseCreateDTO: CourseCreateDTO = req.body;
    const machineId = req.header("machineId");
    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const { location } = image;

    try {
        const data = await courseService.createCourse(courseCreateDTO, location, machineId);

        if (!data) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.CREATE_COURSE_FAIL));
        }
        return res.status(sc.OK).send(success(sc.OK, rm.CREATE_COURSE_SUCCESS));
    } catch (e) {
        console.error(e);
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

const courseController = {
    createCourse,
};

export default courseController;