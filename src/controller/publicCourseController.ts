import { Request, Response } from "express";
import { publicCourseService } from "../service";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import { PublicCourseCreateRequestDTO, PublicCourseCreateResponseDTO } from "../interface/DTO/PublicCourseCreateDTO";
import { validationResult } from "express-validator";
import { timestampConvertString } from "../module/convert/convertTime";

const createPublicCourse = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보(courseId, title, description이 안들어왔을때)
  if (!error.isEmpty()) {
    const validationErrorMsg = error.errors[0].msg; //일단 이렇게두고 나중에 errorformatter 차용해서 자세히적기
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const publicCourseCreateRequestDTO: PublicCourseCreateRequestDTO = req.body;

  try {
    const createdPublicCourse = await publicCourseService.createPublicCourse(publicCourseCreateRequestDTO);

    if (!createdPublicCourse) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    } else if (typeof createdPublicCourse === "string" || createdPublicCourse instanceof String) {
      console.log(createdPublicCourse);
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, createdPublicCourse as string));
    } else {
      //db에서 출력받은 timestamp를 string으로 변환
      const createdAt = timestampConvertString(createdPublicCourse.created_at);

      const publicCourseCreateResponseDTO: PublicCourseCreateResponseDTO = {
        publicCourse: {
          createdAt: createdAt,
          id: createdPublicCourse.id,
        },
      };
      return res.status(sc.OK).send(success(sc.OK, rm.UPLOAD_PUBLIC_COURSE, publicCourseCreateResponseDTO));
    }
  } catch (error) {
    //console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getPublicCourseByUser = async (req: Request, res: Response) => {};

const getPublicCourseDetail = async (req: Request, res: Response) => {};

const recommendPublicCourse = async (req: Request, res: Response) => {};

const searchPublicCourse = async (req: Request, res: Response) => {};

const publicCourseController = {
  createPublicCourse,
  getPublicCourseByUser,
  getPublicCourseDetail,
  recommendPublicCourse,
  searchPublicCourse,
};

export default publicCourseController;