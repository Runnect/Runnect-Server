import { RecommendPublicCourse, PublicCourse, PublicCourseGetDTO, PublicCourseDetailGetDTO } from "../interface/DTO/publicCourse/PublicCourseGetDTO";
import { Request, Response } from "express";
import { publicCourseService } from "../service";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import { PublicCourseCreateRequestDTO, PublicCourseCreateResponseDTO } from "../interface/DTO/publicCourse/PublicCourseCreateDTO";
import { validationResult } from "express-validator";
import { dateConvertString } from "../module/convert/convertTime";
import { checkScrap } from "../module/check/checkScrap";
import { UpdatePublicCourseDTO, UpdatePublicCourseResponseDTO } from "../interface/DTO/publicCourse/UpdatePublicCourseDTO";

const createPublicCourse = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보(courseId, title, description이 안들어왔을때)
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const publicCourseCreateRequestDTO: PublicCourseCreateRequestDTO = req.body;

  try {
    const createdPublicCourse = await publicCourseService.createPublicCourse(publicCourseCreateRequestDTO);

    if (!createdPublicCourse) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    } else if (typeof createdPublicCourse === "string" || createdPublicCourse instanceof String) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, createdPublicCourse as string));
    } else {
      //db에서 출력받은 timestamp를 string으로 변환
      const createdAt = dateConvertString(createdPublicCourse.created_at);

      const publicCourseCreateResponseDTO: PublicCourseCreateResponseDTO = {
        publicCourse: {
          createdAt: createdAt,
          id: createdPublicCourse.id,
        },
      };
      return res.status(sc.CREATED).send(success(sc.CREATED, rm.UPLOAD_PUBLIC_COURSE, publicCourseCreateResponseDTO));
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getPublicCourseByUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보가 없을때
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const userId: number = req.body.userId;

  try {
    const publicCourseByUser = await publicCourseService.getPublicCourseByUser(userId);

    if (!publicCourseByUser) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_PUBLIC_COURSE_FAIL));
    } else {
      const publicCourses: PublicCourse[] = publicCourseByUser.map((pc: any) => {
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
      });

      const publicCourseGetDTO: PublicCourseGetDTO = {
        user: {
          id: userId,
        },
        publicCourses: publicCourses,
      };

      return res.status(sc.OK).send(success(sc.OK, rm.READ_PUBLIC_COURSE_BY_USER, publicCourseGetDTO));
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getPublicCourseDetail = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보(machineId, publicCourseId가 안들어왔을때)
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const userId: number = req.body.userId;
  const { publicCourseId } = req.params; //위에서 검사했어도 스트링으로옴

  try {
    const publicCourseDetail = await publicCourseService.getPublicCourseDetail(userId, +publicCourseId); //퍼블릭 코스아이디 number로 타입변환
    if (!publicCourseDetail || publicCourseDetail.length == 0) {
      res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_PUBLIC_COURSE_ID));
    } else {
      return res.status(sc.OK).send(success(sc.OK, rm.READ_PUBLIC_COURSE_DETAIL_SUCCESS, publicCourseDetail));
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const recommendPublicCourse = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보(machineId이 안들어왔을때)
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const userId: number = req.body.userId;

  // countPerPage -> 페이지 크기(한 페이지에 몇 개의 데이터)
  const pageSize = 20; // 20개씩 넘겨줌
  // pageNo -> 페이지 번호(몇 번 페이지)
  let pageNo = parseInt(req.query.pageNo as string);
  // 페이지번호가 요청으로 들어오지 않을시 자동으로 1번 req
  if (!pageNo) pageNo = 1;

  try {
    const recommendedPublicCourse = await publicCourseService.recommendPublicCourse(userId, pageSize, pageNo);

    // 가지고 있는 데이터보다 더 큰 페이지 번호를 요청했을 경우
    if (recommendedPublicCourse == "invalidPageNo") {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_PAGE_NUMBER));
    }

    if (!recommendedPublicCourse) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_PUBLIC_COURSE_FAIL));
    } else {
      const publicCourses: RecommendPublicCourse[] = recommendedPublicCourse.map((rbc) => {
        const pc: RecommendPublicCourse = {
          pageNo: pageNo,
          id: rbc.id,
          courseId: rbc.course_id,
          title: rbc.title,
          image: rbc.Course.image,
          scrap: checkScrap(rbc.Scrap),
          departure: {
            region: rbc.Course.departure_region,
            city: rbc.Course.departure_city,
          },
        };

        return pc;
      });

      return res.status(sc.OK).send(success(sc.OK, rm.READ_RECOMMENDED_COURSE_SUCCESS, { publicCourses }));
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const searchPublicCourse = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보가 안들어왔을때
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const userId: number = req.body.userId;
  const { keyword } = req.query;

  try {
    const searchedPublicCourse = await publicCourseService.searchPublicCourse(userId, keyword as string);

    if (!searchedPublicCourse) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_PUBLIC_COURSE_FAIL));
    } else {
      const publicCourses: PublicCourse[] = searchedPublicCourse.map((spc) => {
        const pc: PublicCourse = {
          id: spc.id,
          courseId: spc.course_id,
          title: spc.title,
          image: spc.Course.image,
          scrap: checkScrap(spc.Scrap),
          departure: {
            region: spc.Course.departure_region,
            city: spc.Course.departure_city,
          },
        };

        return pc;
      });

      return res.status(sc.OK).send(success(sc.OK, rm.READ_SEARCHED_COURSE_SUCCESS, { publicCourses }));
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const updatePublicCourse = async (req: Request, res: Response) => {
  const error = validationResult(req);
  //에러처리 1 : 필요한 정보(courseId, title, description)가 안들어왔을때
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const { publicCourseId } = req.params;
  const UpdatePublicCourseDTO: UpdatePublicCourseDTO = req.body;

  try {
    const updatePublicCourse = await publicCourseService.updatePublicCourse(+publicCourseId, UpdatePublicCourseDTO);

    if (!updatePublicCourse) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.INVALID_PUBLIC_COURSE_ID));
    } else {
      const updatedPublicCourseResponseDTO: UpdatePublicCourseResponseDTO = {
        publicCourse: { id: updatePublicCourse.id, title: updatePublicCourse.title, description: updatePublicCourse.description },
      };
      return res.status(sc.OK).send(success(sc.OK, rm.UPDATE_COURSE_SUCCESS, updatedPublicCourseResponseDTO));
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const deletePublicCourse = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const publicCourseIdList = req.body.publicCourseIdList;

  try {
    const data = await publicCourseService.deletePublicCourse(publicCourseIdList);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DELETE_PUBLIC_COURSE_FAIL));
    else if (typeof data == "string") {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, data as string));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_PUBLIC_COURSE_SUCCESS, { deletedPublicCourseCount: data }));
  } catch (e) {
    console.error(e);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const publicCourseController = {
  createPublicCourse,
  getPublicCourseByUser,
  getPublicCourseDetail,
  recommendPublicCourse,
  searchPublicCourse,
  updatePublicCourse,
  deletePublicCourse,
};

export default publicCourseController;
