import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// option --> c (코스 그리기), s (스크랩), u (업로드), r (달리기 및 기록)
const createStampByUser = async (userId: number, option: string) => {
  try {
    const getCounts: any = await getCount(userId, option); // option에 해당하는 활동 갯수 가져옴 -> c: 코스 몇 번 그렸는지, s: 스크랩 몇 번 했는지, ...
    if (!getCounts) {
      return;
    }
    const stampLevel = chkStampNumber(getCounts, option); //스탬프를 추가할지안할지, 한다면 어떤 스탬프인지
    if (stampLevel == -1) {
      return;
    } else {
      await createStampToUser(userId, option, stampLevel); //스탬프 추가 및 유저의 이미지변경
      await chkLevel(userId); //추가된 스탬프를 포함한 유저의 스탬프 개수를 세서 유저의 레벨 업데이트
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const chkLevel = async (userId: number) => {
  try {
    const stampNumber = (
      await prisma.userStamp.findMany({
        where: {
          user_id: userId,
        },
      })
    ).length;

    if (stampNumber % 4 == 0 && stampNumber <= 12) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          level: stampNumber / 4 + 1,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const chkStampNumber = (getCounts: number, option: string) => {

  const stampRule = {
    c: [1, 10, 30],
    s: [1, 20, 40],
    u: [1, 10, 30],
    r: [1, 15, 30],
  };

  if (getCounts == stampRule[option as keyof typeof stampRule][2]) {
    return 3;
  } else if (getCounts == stampRule[option as keyof typeof stampRule][1]) {
    return 2;
  } else if (getCounts == stampRule[option as keyof typeof stampRule][0]) {
    return 1;
  } else {
    return -1;
  }
};

const createStampToUser = async (userId: number, option: string, stampLevel: number) => {
  // 스탬프를 UserStamp에 추가 & User의 latest stamp 업데이트
  try {
    const stampId = option + stampLevel;
    await prisma.userStamp.create({
      data: {
        stamp_id: stampId,
        user_id: userId,
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        latest_stamp: stampId,
        modified_at: new Date(),
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getCount = async (userId: number, option: string) => {
  // 옵션에 해당하는 활동 횟수 가져옴
  let dataCount;
  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (option == "c") {
    // 코스 그리기
    dataCount = userInfo?.created_course;
  } else if (option == "s") {
    // 스크랩
    dataCount = userInfo?.created_scrap;
  } else if (option == "u") {
    // 업로드
    dataCount = userInfo?.created_public_course;
  } else if (option == "r") {
    // 달리기
    dataCount = userInfo?.created_record;
  } else {
    return null;
  }
  return dataCount;
};

const getStampByUser = async (userId: number) => {
  try {
    const stampData = await prisma.userStamp.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        stamp_id: "asc",
      },
    });
    return stampData;
  } catch (error) {
    console.log(error);
    throw error;
  } //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
};

const stampService = {
  createStampByUser,
  getStampByUser,
};

export default stampService;
