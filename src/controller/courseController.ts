import { CourseCreateDTO } from './../interface/course/CourseCreateDTO';
import { validationResult } from 'express-validator';
import { success, fail } from './../constant/response';
import { Request, Response } from "express";
import { rm, sc } from '../constant';
import { courseService } from '../service';
import { requestConvertDeparture } from '../module/convert/requestConvertDeparture';





const courseController = {
    getCourseByUser,
};

export default courseController;