import { PrismaClient } from "@prisma/client";
import { scrapDTO } from "./../interface/DTO/scrapDTO";
const prisma = new PrismaClient();

const createScrap = async (scrapDTO: scrapDTO) => {
  try {
    const userData = await prisma.user.findUnique({
      where: { machine_id: scrapDTO.machineId },
    });
    if (!userData) {
      return "NoUser";
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
    const scrapId = await prisma.scrap.findMany({
      where: {
        user_machine_id: scrapDTO.machineId,
        public_course_id: scrapDTO.publicCourseId,
      },
      select: {
        id: true,
      },
    });
    const deleteScrap = await prisma.scrap.update({
      where: { id: scrapId[0]["id"] },
      data: { scrapTF: false },
    });
    return deleteScrap;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const scrapService = { createScrap, deleteScrap };

export default scrapService;
