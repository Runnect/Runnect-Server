import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const prisma = new PrismaClient();

// option --> c (코스 그리기), s (스크랩), u (업로드), r (달리기 및 기록)
const createStampByUser = async (machineId: string, option: string) => {
    try {
        const getCounts: any = await getCount(machineId, option); // option에 해당하는 활동 갯수 가져옴 -> c: 코스 몇 번 그렸는지, s: 스크랩 몇 번 했는지, ...
        if (!getCounts) {
            return; // 에러 처리 해줘야 함. option에 해당하는 활동 아무것도 안 했다는 뜻이거나 option 잘못줬다는
        }

        const stampLevel = chkStampNumber(getCounts);
        if (stampLevel == -1) {
            return;
        } else {
            await createStampToUser(machineId, option, stampLevel);
            await chkLevel(machineId);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const chkLevel = async (machineId: string) => {
    try {
        const stampNumber = (await prisma.userStamp.findMany({
            where: {
                user_machine_id: machineId,
            },
        })).length;

        if ((stampNumber % 4 == 0) && (stampNumber <= 12)) {
            await prisma.user.update({
                where: {
                    machine_id: machineId,
                },
                data: {
                    level: (stampNumber / 4) + 1,
                },
            });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const chkStampNumber = (getCounts: number) => {
    if (getCounts == 10) {
        return 3;
    } else if (getCounts == 5) {
        return 2;
    } else if (getCounts == 1) {
        return 1;
    } else {
        return -1;
    }
};

const createStampToUser = async (machineId: string, option: string, stampLevel: number) => { // 스탬프를 UserStamp에 추가 & User의 latest stamp 업데이트
    try {
        const stampId = option + stampLevel;
        const latest_stamp = await prisma.userStamp.create({
            data: {
                stamp_id: stampId,
                user_machine_id: machineId,
            },
        });

        await prisma.user.update({ 
            where: {
                machine_id: machineId,
            },
            data: {
                latest_stamp: latest_stamp.stamp_id,
            },
        });

    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getCount = async(machineId: string, option: string) => { // 옵션에 해당하는 활동 횟수 가져옴
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