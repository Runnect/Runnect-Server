import { Request, Response } from "express";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import { validationResult } from "express-validator";
import {
  timestampConvertString,
  stringConvertTime,
  dateConvertString,
} from "../module/convert/convertTime";
import { recordService } from "../service";
import {
  recordRequestDTO,
  recordResponseDTO,
  getRecordByUserResponseDTO,
  records,
} from "./../interface/DTO/recordDTO";

const createRecord = async (req: Request, res: Response) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const nonValue = error["errors"][0]["param"];
      let errorMsg;
      console.log(nonValue);
      switch (nonValue) {
        case "machineid": {
          errorMsg = error["errors"][0].msg;
          break;
        }
        case "courseId": {
          errorMsg = error["errors"][0].msg;
          break;
        }
        case "title": {
          errorMsg = error["errors"][0].msg;
          break;
        }
        case "time": {
          errorMsg = error["errors"][0].msg;
          break;
        }
        case "pace": {
          errorMsg = error["errors"][0].msg;
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

const getRecordByUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const machineId = req.header("machineId") as string;
  try {
    const getRecordByUser = await recordService.getRecordByUser(machineId);
    if (!getRecordByUser) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
    } else {
      const recordsArray: records[] = getRecordByUser.map((pc: any) => {
        let record: records = {
          id: pc.id,
          courseId: pc.Course.id,
          publicCourseId: pc.public_course_id,
          machineId: machineId,
          title: pc.title,
          image: pc.Course.image,
          createdAt: timestampConvertString(pc.created_at),
          distance: pc.Course.distance,
          time: dateConvertString(pc.time).substring(11, 19),
          pace: dateConvertString(pc.pace).substring(11, 19),
          departure: {
            region: pc.Course.departure_region,
            city: pc.Course.departure_city,
          },
        };
        return record;
      });
      const getRecordByUserResponseDTO: getRecordByUserResponseDTO = {
        user: { machineId: machineId },
        records: recordsArray,
      };
      return res
        .status(sc.OK)
        .send(
          success(sc.OK, rm.READ_RECORD_SUCCESS, getRecordByUserResponseDTO)
        );
    }
  } catch (error) {
    console.log(error);
    return res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const recordController = { createRecord, getRecordByUser };
export default recordController;
