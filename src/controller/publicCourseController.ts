import {
  PublicCourse,
  PublicCourseGetDTO,
} from "./../interface/DTO/PublicCourseGetDTO";
import { Request, Response } from "express";
import { publicCourseService } from "../service";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import {
  PublicCourseCreateRequestDTO,
  PublicCourseCreateResponseDTO,
} from "../interface/DTO/PublicCourseCreateDTO";
import { validationResult } from "express-validator";
import { dateConvertString } from "../module/convert/convertTime";

const createPublicCourse = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보(courseId, title, description이 안들어왔을때)
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg; //일단 이렇게두고 나중에 errorformatter 차용해서 자세히적기
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const publicCourseCreateRequestDTO: PublicCourseCreateRequestDTO = req.body;

  try {
    const createdPublicCourse = await publicCourseService.createPublicCourse(
      publicCourseCreateRequestDTO
    );

    if (!createdPublicCourse) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    } else if (
      typeof createdPublicCourse === "string" ||
      createdPublicCourse instanceof String
    ) {
      return res
        .status(sc.BAD_REQUEST)
        .send(fail(sc.BAD_REQUEST, createdPublicCourse as string));
    } else {
      //db에서 출력받은 timestamp를 string으로 변환
      const createdAt = dateConvertString(createdPublicCourse.created_at);

      const publicCourseCreateResponseDTO: PublicCourseCreateResponseDTO = {
        publicCourse: {
          createdAt: createdAt,
          id: createdPublicCourse.id,
        },
      };
      return res
        .status(sc.OK)
        .send(
          success(sc.OK, rm.UPLOAD_PUBLIC_COURSE, publicCourseCreateResponseDTO)
        );
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getPublicCourseByUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보(machineId이 안들어왔을때)
  if (!error.isEmpty()) {
    const validationErrorMsg = error.errors[0].msg; //일단 이렇게두고 나중에 errorformatter 차용해서 자세히적기
    return res
      .status(sc.BAD_REQUEST)
      .send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const machineId: string = req.header("machineId") as string;

  try {
    const publicCourseByUser = await publicCourseService.getPublicCourseByUser(
      machineId
    );

    if (!publicCourseByUser) {
      return res
        .status(sc.OK)
        .send(
          success(sc.OK, rm.READ_PUBLIC_COURSE_BY_USER, publicCourseByUser)
        );
    } else {
      const publicCourses: PublicCourse[] = publicCourseByUser.map(
        (pc: any) => {
          let publicCourse: PublicCourse = {
            id: pc.PublicCourse.id,
            courseId: pc.id,
            title: pc.PublicCourse.title,
            image: pc.image,
            departure: {
              region: pc.departure_region,
              city: pc.departure_city,
            },
          };
          return publicCourse;
        }
      );

      const publicCourseGetDTO: PublicCourseGetDTO = {
        user: {
          machineId: machineId,
        },
        publicCourses: publicCourses,
      };

      return res
        .status(sc.OK)
        .send(
          success(sc.OK, rm.READ_PUBLIC_COURSE_BY_USER, publicCourseGetDTO)
        );
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res
      .status(sc.INTERNAL_SERVER_ERROR)
      .send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

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
