import { Request, Response } from "express";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import { validationResult } from "express-validator";
import { scrapService } from "../service";
import { scrapDTO, getScrapResponseDTO, scrap } from "../interface/DTO/scrap/scrapDTO";

const createAndDeleteScrap = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const userId: number = req.body.userId;
  const { publicCourseId, scrapTF } = req.body;

  const scrapDTO: scrapDTO = {
    userId: userId,
    publicCourseId: +publicCourseId,
    scrapTF: scrapTF,
  };

  try {
    if (scrapTF == true || scrapTF == "true") {
      const createScrap = await scrapService.createScrap(scrapDTO);
      if (!createScrap) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
      } else if (typeof createScrap === "string" || createScrap instanceof String) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, createScrap as string));
      } else {
        return res.status(sc.OK).send(success(sc.OK, rm.CREATE_SCRAP_SUCCESS));
      }
    } else {
      const deleteScrap = await scrapService.deleteScrap(scrapDTO);
      if (!deleteScrap) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
      } else if (deleteScrap["count"] == 0) {
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_SCRAP_RECORD));
      } else {
        return res.status(sc.OK).send(success(sc.OK, rm.DELETE_SCRAP_SUCCESS));
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getScrapCourseByUSer = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const userId: number = req.body.userId;
  try {
    const getScrapCourse = await scrapService.getScrapCourseByUser(userId);
    if (!getScrapCourse) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    } else {
      const scrapsArray: scrap[] = getScrapCourse.map((pc: any) => {
        let scrap: scrap = {
          id: pc.id,
          publicCourseId: pc.public_course_id,
          courseId: pc.PublicCourse.Course.id,
          title: pc.PublicCourse.title,
          image: pc.PublicCourse.Course.image,
          departure: {
            region: pc.PublicCourse.Course.departure_region,
            city: pc.PublicCourse.Course.departure_city,
          },
        };
        return scrap;
      });
      const getScrapResponseDTO: getScrapResponseDTO = {
        user: {
          id: userId,
        },
        Scraps: scrapsArray,
      };
      return res.status(sc.OK).send(success(sc.OK, rm.READ_SCRAP_COURSE_SUCCESS, getScrapResponseDTO));
    }
  } catch (error) {
    console.log(error);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const scrapController = { createAndDeleteScrap, getScrapCourseByUSer };
export default scrapController;
