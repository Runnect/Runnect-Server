import { PrismaClient } from "@prisma/client";
import { scrapDTO } from "../interface/DTO/scrap/scrapDTO";
import { stampService } from "../service";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";

const prisma = new PrismaClient();

const createScrap = async (scrapDTO: scrapDTO) => {
  try {
    const scrapId = await prisma.scrap.findFirst({
      where: {
        user_id: scrapDTO.userId,
        public_course_id: scrapDTO.publicCourseId,
      },
      select: {
        id: true,
      },
    });
    if (scrapId) {
      // 이미 이전에 해당 유저가 해당 퍼블릭 코스를 스크랩한적이 있는경우
      const updateScrap = await prisma.scrap.update({
        where: { id: scrapId["id"] },
        data: { scrapTF: true },
      });
      return updateScrap;
    } else {
      // 이미 이전에 해당 유저가 해당 퍼블릭 코스를 스크랩한적이 없는경우
      const addScrap = await prisma.scrap.create({
        data: {
          user_id: scrapDTO.userId,
          public_course_id: scrapDTO.publicCourseId,
        },
      });
      if (!addScrap) {
        return null;
      } else {
        await stampService.createStampByUser(scrapDTO.userId, "s"); //처음 스크랩한것이기 때문에 스탬프검사하기
        return addScrap;
      }
    }
  } catch (error) {
    //~ error 분기 처리 : db의 제약조건등을 위반시 생기는 에러
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        //~ fk 외래키제약조건실패
        //없는 코스또는 없는 유저
        return `${error.meta?.field_name}의 아이디가 유효하지 않습니다.`;
      }
    }
    //~ error 분기 처리 : db 칼럼의 데이터 타입을 지키지 않을때, null이 될수 없는 필드가 누락되었을때
    else if (error instanceof PrismaClientValidationError) {
      return `${error.message}`;
    }
    throw error;
  }
};

const deleteScrap = async (scrapDTO: scrapDTO) => {
  try {
    const deleteScrap = await prisma.scrap.updateMany({
      where: {
        user_id: scrapDTO.userId,
        public_course_id: scrapDTO.publicCourseId,
      },
      data: { scrapTF: false },
    });

    return deleteScrap;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getScrapCourseByUser = async (userId: number) => {
  try {
    const scrapCourseData = await prisma.scrap.findMany({
      where: {
        AND: [{ user_id: userId }, { scrapTF: true }],
      },
      include: {
        PublicCourse: {
          include: {
            Course: true,
          },
        },
      },
    });
    return scrapCourseData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const scrapService = { createScrap, deleteScrap, getScrapCourseByUser };

export default scrapService;
