import { Request, Response } from "express";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import { validationResult } from "express-validator";
import { timestampConvertString } from "../module/convert/convertTime";
import { recordService } from "../service";
import {
  recordRequestDTO,
  recordResponseDTO,
} from "./../interface/DTO/recordDTO";

const stringConvertTime = (string: string) => {
  var time = new Date();
  var [hours, minutes, seconds] = string.split(":");
  time.setHours(+hours);
  time.setMinutes(+minutes);
  time.setSeconds(+seconds);

  return time;
};

const createRecord = async (req: Request, res: Response) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const nonValue = error["errors"][0]["param"];
      let errorMsg;
      console.log(nonValue);
      switch (nonValue) {
        case "title": {
          errorMsg = rm.NO_RECORD_TITLE;
          break;
        }
        case "time": {
          errorMsg = rm.NO_RECORD_TIME;
          break;
        }
        case "pace": {
          errorMsg = rm.NO_RECORD_PACE;
          break;
        }
        default: {
          errorMsg = rm.NULL_VALUE;
          break;
        }
      }
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, errorMsg));
    }
    const { courseId, publicCourseId, title, time, pace } = req.body;
    const recordRequestDTO: recordRequestDTO = {
      machineId: req.header("machineId") as string,
      courseId: courseId,
      publicCourseId: publicCourseId,
      title: title,
      time: stringConvertTime(time),
      pace: stringConvertTime(pace),
    };
    const record = await recordService.createRecord(recordRequestDTO);
    if (!record) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.INVALID_COURSEID));
    } else {
      const createdAt = timestampConvertString(record.created_at);
      const recordResponseDTO: recordResponseDTO = {
        record: {
          id: record.id,
          createdAt: createdAt,
        },
      };
      return res
        .status(sc.OK)
        .send(success(sc.OK, rm.UPLOAD_RECORD, recordResponseDTO));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const recordController = { createRecord };
export default recordController;
