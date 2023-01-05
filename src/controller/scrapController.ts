import { Request, Response } from "express";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import { validationResult } from "express-validator";
import { scrapService } from "../service";
import { scrapDTO } from "./../interface/DTO/scrapDTO";

const createAndDeleteScrap = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const machineId = req.header("machineId") as string;
  const { publicCourseId, scrapTF } = req.body;
  const scrapDTO: scrapDTO = {
    machineId: machineId,
    publicCourseId: +publicCourseId,
    scrapTF: scrapTF,
  };
  try {
    if (scrapTF == true) {
      const createScrap = await scrapService.createScrap(scrapDTO);
      if (!createScrap) {
        return res
          .status(sc.BAD_REQUEST)
          .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
      } else if (createScrap == "NoUser") {
        return res
          .status(sc.BAD_REQUEST)
          .send(fail(sc.BAD_REQUEST, rm.INVALID_USER));
      } else {
        return res.status(sc.OK).send(success(sc.OK, rm.CREATE_SCRAP_SUCCESS));
      }
    } else {
      const deleteScrap = await scrapService.deleteScrap(scrapDTO);
      if (!deleteScrap) {
        return res
          .status(sc.BAD_REQUEST)
          .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
      } else {
        return res.status(sc.OK).send(success(sc.OK, rm.DELETE_SCRAP_SUCCESS));
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const scrapController = { createAndDeleteScrap };
export default scrapController;
