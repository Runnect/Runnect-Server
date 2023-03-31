"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// option --> c (코스 그리기), s (스크랩), u (업로드), r (달리기 및 기록)
const createStampByUser = (userId, option) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getCounts = yield getCount(userId, option); // option에 해당하는 활동 갯수 가져옴 -> c: 코스 몇 번 그렸는지, s: 스크랩 몇 번 했는지, ...
        if (!getCounts) {
            return;
        }
        const stampLevel = chkStampNumber(getCounts); //스탬프를 추가할지안할지, 한다면 어떤 스탬프인지
        if (stampLevel == -1) {
            return;
        }
        else {
            yield createStampToUser(userId, option, stampLevel); //스탬프 추가 및 유저의 이미지변경
            yield chkLevel(userId); //추가된 스탬프를 포함한 유저의 스탬프 개수를 세서 유저의 레벨 업데이트
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const chkLevel = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stampNumber = (yield prisma.userStamp.findMany({
            where: {
                user_id: userId,
            },
        })).length;
        if (stampNumber % 4 == 0 && stampNumber <= 12) {
            yield prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    level: stampNumber / 4 + 1,
                },
            });
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const chkStampNumber = (getCounts) => {
    if (getCounts == 10) {
        return 3;
    }
    else if (getCounts == 5) {
        return 2;
    }
    else if (getCounts == 1) {
        return 1;
    }
    else {
        return -1;
    }
};
const createStampToUser = (userId, option, stampLevel) => __awaiter(void 0, void 0, void 0, function* () {
    // 스탬프를 UserStamp에 추가 & User의 latest stamp 업데이트
    try {
        const stampId = option + stampLevel;
        yield prisma.userStamp.create({
            data: {
                stamp_id: stampId,
                user_id: userId,
            },
        });
        yield prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                latest_stamp: stampId,
                modified_at: new Date(),
            },
        });
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const getCount = (userId, option) => __awaiter(void 0, void 0, void 0, function* () {
    // 옵션에 해당하는 활동 횟수 가져옴
    let dataCount;
    if (option == "c") {
        // 코스 그리기
        dataCount = (yield prisma.course.findMany({
            where: {
                AND: [{ user_id: userId }, { deleted_at: null }],
            },
        })).length;
    }
    else if (option == "s") {
        // 스크랩
        dataCount = (yield prisma.scrap.findMany({
            where: {
                user_id: userId,
            },
        })).length;
    }
    else if (option == "u") {
        // 업로드
        dataCount = (yield prisma.course.findMany({
            where: {
                AND: [{ user_id: userId }, { deleted_at: null }, { private: false }],
            },
        })).length;
        // dataCount = (await prisma.publicCourse.findMany({ // 퍼블릭 코스에서 가져올 때
        //     where: {
        //         deleted_at: null,
        //         Course: {
        //             User: {
        //                 machine_id: machineId,
        //             },
        //         },
        //     },
        // })).length;
    }
    else if (option == "r") {
        // 달리기
        dataCount = (yield prisma.record.findMany({
            where: {
                AND: [{ user_id: userId }, { deleted_at: null }],
            },
        })).length;
    }
    else {
        return null;
    }
    return dataCount;
});
const getStampByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stampData = yield prisma.userStamp.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                stamp_id: "asc",
            },
        });
        return stampData;
    }
    catch (error) {
        console.log(error);
        throw error;
    } //~ get은 에러분기처리를 할게없음... 어차피 데이터가 있냐없냐라서
});
const stampService = {
    createStampByUser,
    getStampByUser,
};
exports.default = stampService;
//# sourceMappingURL=stampService.js.map