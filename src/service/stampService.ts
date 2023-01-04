import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// option --> c (코스 그리기), s (스크랩), u (업로드), r (달리기 및 기록)
const createStampByUser = async (machineId: string, option: string) => {
    try {
        const stampLevel = await stampIsFullChk(machineId, option); // 스탬프의 최고 레벨? : c1, c2 모았다 -> 2

        if (stampLevel == 3) return; // 더 이상 모을 스탬프가 없기 때문에 바로 return
        
        const getCounts: any = await getCount(machineId, option); // option에 해당하는 활동 갯수 가져옴 -> c: 코스 몇 번 그렸는지, s: 스크랩 몇 번 했는지, ...
        if (!getCounts) {
            return; // 에러 처리 해줘야 함. option에 해당하는 활동 아무것도 안 했다는 뜻이거나 option 잘못줬다는
        }
        
        if (stampLevel == 0) { // 어떠한 스탬프도 없는 상황
            if (getCounts >= 1) {
                await createStampToUser(machineId, option, 1); // 옵션이 c라면 -> c1 스탬프 만들겠다는 뜻
            } else return;
        } else if (stampLevel == 1) { // x1 까지 획득한 상황
            if (getCounts >= 5) {
                await createStampToUser(machineId, option, 2);
            } else return;
        } else if (stampLevel == 2) { // x2 까지 획득한 상황
            if (getCounts >= 10) {
                await createStampToUser(machineId, option, 3);
            } else return;
        } else {
            return; // 에러처리
        }


    } catch (error) {
        console.error(error);
        throw error;
    }
};

const chkLevel = async (machineId: string) => {
    try {
        const stampNumber = await prisma.userStamp.findMany({
            where: {
                user_machine_id: machineId,
            },
        });


    } catch (error) {
        console.error(error);
        throw error;
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

const stampIsFullChk = async (machineId: string, option: string) => { // 옵션에 해당하는 최신 스탬프를 가져옴
    const getStamp: any = await prisma.userStamp.findFirst({
        where: {
            user_machine_id: machineId,
            stamp_id: {
                startsWith: option,
            },
        },
        orderBy: {
            stamp_id: "desc",
        },
    });
    
    if (!getStamp) {
        return 0;
    } else {
        return +(getStamp[0]['stamp_id'] as string)[1]; // 숫자만 return, c2 -> 2
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