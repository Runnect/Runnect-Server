import { PrismaClient } from "@prisma/client";
import { recordRequestDTO } from "./../interface/DTO/recordDTO";
const prisma = new PrismaClient();

const createRecord = async (recordRequestDTO: recordRequestDTO) => {
  try {
    const recordData = await prisma.record.create({
      data: {
        user_machine_id: recordRequestDTO.machineId,
        course_id: +recordRequestDTO.courseId,
        public_course_id: recordRequestDTO.publicCourseId,
        title: recordRequestDTO.title,
        pace: recordRequestDTO.pace,
        time: recordRequestDTO.time,
      },
    });
    if (!recordData) {
      return null;
    } else {
      return recordData;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const recordService = {
  createRecord,
};

export default recordService;
