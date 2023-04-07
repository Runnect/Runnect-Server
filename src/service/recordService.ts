import { PrismaClient } from "@prisma/client";
import { recordRequestDTO } from "../interface/DTO/record/recordDTO";
import { stampService } from "../service";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { rm } from "../constant";
const prisma = new PrismaClient();

const createRecord = async (recordRequestDTO: recordRequestDTO) => {
  try {
    const recordData = await prisma.record.create({
      data: {
        user_id: recordRequestDTO.userId,
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
      await stampService.createStampByUser(recordRequestDTO.userId, "r");
      return recordData;
    }
  } catch (error) {
    //~ error 분기 처리 : db의 제약조건등을 위반시 생기는 에러

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2009") {
        //~ 쿼리 유효성 검사 실패
        //db 필드에 맞는 input 값이 아님
        return rm.OUT_OF_VALUE;
      } else if (error.code === "P2003") {
        //~ fk 외래키제약조건실패
        //없는 코스
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

const getRecordByUser = async (userId: number) => {
  try {
    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userData) {
      return null;
    } else {
      const recordData = await prisma.record.findMany({
        where: { user_id: userId },
        include: {
          Course: {
            include: {
              User: true,
            },
          },
        },
        orderBy: {
          created_at: "desc", // 최신순이니까 desc
        },
      });
      if (!recordData) {
        return [];
      } else {
        return recordData;
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteRecord = async (recordIdList: Array<number>) => {
  try {
    const data = await prisma.record.deleteMany({
      where: {
        id: {
          in: recordIdList,
        }
      },
    });
    return data.count;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
      return `존재하지 않는 기록입니다.`;
    } else {
      console.log(error);
    }
    throw error;
  }
};
const updateRecord = async (recordId: number, title: string) => {
  try {
    const updateTitle = await prisma.record.update({
      where: {
        id: recordId,
      },
      data: {
        title: title,
      },
    });

    return updateTitle;
  } catch (error) {
    console.log(error);
  }
};

const recordService = { createRecord, getRecordByUser, updateRecord, deleteRecord };

export default recordService;
