import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createStampByUser = async (machineId: string, option: string) => {
    const getCounts = getCount(machineId, option);
    
   

};

const getCount = async(machineId: string, option: string) => {
    let dataCount;
    if (option == 'course') { // 코스 그리기
        dataCount = (await prisma.course.findMany({
            where: {
                AND: [{ user_machine_id: machineId }, { deleted_at: null }],
            },
        })).length;


    } else if (option == 'scrap') { // 스크랩
        dataCount = (await prisma.scrap.findMany({
            where: {
                user_machine_id: machineId,
            },
        })).length;

    } else if (option == 'upload') { // 업로드
        dataCount = (await prisma.course.findMany({
            where: {
                AND: [{ user_machine_id: machineId }, { deleted_at: null }, {private: false}],
            },
        })).length;

    } else if (option == 'record') { // 달리기
        dataCount = (await prisma.record.findMany({
            where: {
                AND: [{ user_machine_id: machineId }, { deleted_at: null }],
            },
        })).length;
    } else {
        return null;
    }
    return dataCount;
};

const stampService = {
    createStampByUser,
};
  
export default stampService;