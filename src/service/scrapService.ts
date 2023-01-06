import { PrismaClient } from "@prisma/client";
import { scrapDTO } from "./../interface/DTO/scrapDTO";
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
    console.log(scrapId);

    if (scrapId) {
      const scrapAgain = await prisma.scrap.update({
        where: { id: scrapId["id"] },
        data: { scrapTF: true },
      });
      return scrapAgain;
    } else {
      const scrapData = await prisma.scrap.create({
        data: {
          user_machine_id: scrapDTO.machineId,
          public_course_id: scrapDTO.publicCourseId,
          scrapTF: scrapDTO.scrapTF,
        },
      });
      if (!scrapData) {
        return null;
      } else {
        return scrapData;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteScrap = async (scrapDTO: scrapDTO) => {
  try {
    const scrapId = await prisma.scrap.findFirst({
      where: {
        AND: [
          { user_machine_id: scrapDTO.machineId },
          { public_course_id: scrapDTO.publicCourseId },
        ],
      },
      select: {
        id: true,
      },
    });

    if (!scrapId) {
      return null;
    } else {
      const deleteScrap = await prisma.scrap.update({
        where: { id: scrapId["id"] },
        data: { scrapTF: false },
      });
      return deleteScrap;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const scrapService = { createScrap, deleteScrap };

export default scrapService;
