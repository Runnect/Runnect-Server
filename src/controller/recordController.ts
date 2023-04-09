import { create } from "domain";
import { Request, Response } from "express";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import { validationResult } from "express-validator";
import { stringConvertTime, dateConvertString } from "../module/convert/convertTime";
import { recordService } from "../service";
import { recordRequestDTO, recordResponseDTO, getRecordByUserResponseDTO, records } from "../interface/DTO/record/recordDTO";

const createRecord = async (req: Request, res: Response) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const errorMsg = error["errors"][0].msg;
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, errorMsg));
    }
    const { userId, courseId, publicCourseId, title, time, pace } = req.body;

    const recordRequestDTO: recordRequestDTO = {
      userId: userId,
      courseId: courseId,
      publicCourseId: publicCourseId,
      title: title,
      time: stringConvertTime(time),
      pace: stringConvertTime(pace),
    };
    const record = await recordService.createRecord(recordRequestDTO);
    if (!record) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    } else if (typeof record === "string" || record instanceof String) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, record as string));
    } else {
      const createdAt = dateConvertString(record.created_at);
      const recordResponseDTO: recordResponseDTO = {
        record: {
          id: record.id,
          createdAt: createdAt,
        },
      };
      return res.status(sc.OK).send(success(sc.CREATED, rm.UPLOAD_RECORD, recordResponseDTO));
    }
  } catch (error) {
    console.log(error);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getRecordByUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const userId: number = req.body.userId;
  try {
    const getRecordByUser = await recordService.getRecordByUser(userId);
    if (!getRecordByUser) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_USER));
    } else {
      const recordsArray: records[] = getRecordByUser.map((pc: any) => {
        let record: records = {
          id: pc.id,
          courseId: pc.Course.id,
          publicCourseId: pc.public_course_id,
          userId: userId,
          title: pc.title,
          image: pc.Course.image,
          createdAt: dateConvertString(pc.created_at),
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
        user: { id: userId },
        records: recordsArray,
      };
      return res.status(sc.OK).send(success(sc.OK, rm.READ_RECORD_SUCCESS, getRecordByUserResponseDTO));
    }
  } catch (error) {
    console.log(error);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const updateRecord = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const { recordId } = req.params;
  const title = req.body.title;

  try {
    const updateRecord = await recordService.updateRecord(+recordId, title);

    if (!updateRecord) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NO_RECORD_ID));
    } else {
      return res.status(sc.OK).send(success(sc.OK, rm.UPDATE_RECORD_SUCCESS, updateRecord));
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const deleteRecord = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const recordIdList = req.body.recordIdList;

  try {
    const data = await recordService.deleteRecord(recordIdList);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DELETE_RECORD_FAIL));
    else if (typeof data == "string") {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, data as string));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_RECORD_SUCCESS, { deletedRecordIdCount: data }));
  } catch (error) {
    console.log(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const recordController = { createRecord, getRecordByUser, updateRecord, deleteRecord };
export default recordController;
