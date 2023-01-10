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
const runtime_1 = require("@prisma/client/runtime");
const client_1 = require("@prisma/client");
const convertTime_1 = require("../module/convert/convertTime");
const prisma = new client_1.PrismaClient();
const signUp = (machineId, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const createdUser = yield prisma.user.create({
            data: {
                machine_id: machineId,
                nickname: nickname,
            },
        });
        if (!createdUser)
            return null;
        return "success";
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            if (error.code == "P2002") {
                // 이미 생성한 유저
                return `이미 생성된 유저입니다.`;
            }
        }
        else if (error instanceof runtime_1.PrismaClientValidationError) {
            return `${error.message}`;
        }
        throw error;
    }
});
const getUser = (machineId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield prisma.user.findUnique({
            where: {
                machine_id: machineId,
            },
        });
        if (!getUser)
            return null;
        const levelPercent = yield getLevelPercent(machineId);
        const userGetDTO = {
            user: {
                machineId: getUser.machine_id,
                nickname: getUser.nickname,
                latestStamp: getUser.latest_stamp,
                level: getUser.level,
                levelPercent: levelPercent,
            },
        };
        return userGetDTO;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const getLevelPercent = (machineId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userStamp = (yield prisma.userStamp.findMany({
            where: {
                user_machine_id: machineId,
            },
        })).length;
        const levelPercent = (userStamp % 4) * 25;
        return levelPercent;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
const updateUserNickname = (machineId, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield prisma.user.update({
            where: {
                machine_id: machineId,
            },
            data: {
                nickname: nickname,
                modified_at: new Date(),
            },
        });
        if (!updatedUser)
            return null;
        const levelPercent = yield getLevelPercent(machineId);
        const updatedUserGetDTO = {
            user: {
                machineId: updatedUser.machine_id,
                nickname: updatedUser.nickname,
                latestStamp: updatedUser.latest_stamp,
                level: updatedUser.level,
                levelPercent: levelPercent,
                modifiedAt: (0, convertTime_1.dateConvertString)(updatedUser.modified_at),
            },
        };
        return updatedUserGetDTO;
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError) {
            if (error.code == "P2025") {
                return `존재하지 않는 유저입니다.`;
            }
            else if (error.code == `P2002`) {
                return `중복된 닉네임입니다.`;
            }
        }
        else if (error instanceof runtime_1.PrismaClientValidationError) {
            return `${error.message}`;
        }
        throw error;
    }
});
const userService = {
    signUp,
    getUser,
    updateUserNickname,
};
exports.default = userService;
//# sourceMappingURL=userService.js.map