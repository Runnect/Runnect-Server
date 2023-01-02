import { CourseCreateDTO } from './../interface/course/CourseCreateDTO';
import { validationResult } from 'express-validator';
import { success, fail } from './../constant/response';
import { Request, Response } from "express";
import { rm, sc } from '../constant';
import { courseService } from '../service';
import { requestConvertDeparture } from '../module/convert/requestConvertDeparture';

/**
 * @route  POST/course
 * @desc 경로 그리기
 * @access 
 */
const createCourse = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const nonValue = error['errors'][0]['param'];
        let errorMsg;
        console.log(nonValue);
        switch (nonValue) {
            case 'machineid': {
                errorMsg = rm.NO_USER;
                break;
            }
            case 'path': {
                errorMsg = rm.NO_PATH;
                break;
            }
            case 'distance': {
                errorMsg = rm.NO_DISTANCE;
                break;
            }
            default: {
                errorMsg = rm.NO_DEPARTURE;
                break;
            }   
        }
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, errorMsg));
    } 

    const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
    const { location } = image;

    const departureObject = requestConvertDeparture(req.body.departureAddress, req.body.departureName);
    const courseCreateDTO: CourseCreateDTO = {machineId: req.header("machineId") as string, path: req.body.path, distance: Number(req.body.distance), region: departureObject.region, city: departureObject.city, town: departureObject.town, detail: departureObject.detail, name: departureObject.name, image: location};

    // console.dir(courseCreateDTO);

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

const courseController = {
    createCourse,
};

export default courseController;