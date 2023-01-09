import { PrismaClient } from "@prisma/client";
import { scrapDTO } from "./../interface/DTO/scrapDTO";
import { stampService } from "../service";

const prisma = new PrismaClient();

const createScrap = async (scrapDTO: scrapDTO) => {
  try {
    const scrapId = await prisma.scrap.findFirst({
      where: {
        user_machine_id: scrapDTO.machineId,
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
          user_machine_id: scrapDTO.machineId,
          public_course_id: scrapDTO.publicCourseId,
          scrapTF: scrapDTO.scrapTF,
        },
      });
      if (!addScrap) {
        return null;
      } else {
        await stampService.createStampByUser(scrapDTO.machineId, "s"); //처음 스크랩한것이기 때문에 스탬프검사하기
        return addScrap;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteScrap = async (scrapDTO: scrapDTO) => {
  try {
    const deleteScrap = await prisma.scrap.updateMany({
      where: {
        user_machine_id: scrapDTO.machineId,
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

const getScrapCourseByUser = async (machineId: string) => {
  try {
    const scrapCourseData = await prisma.scrap.findMany({
      where: {
        AND: [{ user_machine_id: machineId }, { scrapTF: true }],
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
