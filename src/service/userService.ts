import { UpdatedUserGetDTO } from './../interface/DTO/UpdatedUserGetDTO';
import { UserGetDTO } from './../interface/DTO/UserGetDTO';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaClient } from "@prisma/client";
import { dateConvertString, stringConvertTime } from '../module/convert/convertTime';

const prisma = new PrismaClient();

const signUp = async (machineId: string, nickname: string) => {
    try {
        const createdUser = await prisma.user.create({
            data: {
                machine_id: machineId,
                nickname: nickname,
            }
        });
        if (!createdUser) return null;
        return "success";
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code == "P2002") {
                // 이미 생성한 유저
                return `이미 생성된 유저입니다.`;
            }
        } else if (error instanceof PrismaClientValidationError) {
            return `${error.message}`;
        }
        throw error;
    }
};

const getUser = async (machineId: string) => {
    try {
        const getUser: any = await prisma.user.findUnique({
            where: {
                machine_id: machineId,
            },
        });

        if (!getUser) return null;
        const levelPercent = await getLevelPercent(machineId);
        const userGetDTO: UserGetDTO = {
            user: {
                machineId: getUser.machine_id,
                nickname: getUser.nickname,
                latestStamp: getUser.latest_stamp,
                level: getUser.level,
                levelPercent: levelPercent,
            }
        };
        return userGetDTO;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getLevelPercent = async (machineId: string) => {
    try {
        const userStamp = (await prisma.userStamp.findMany({
            where: {
                user_machine_id: machineId,
            },
        })).length;
        const levelPercent = (userStamp % 4) * 25;
        return levelPercent;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const updateUserNickname = async (machineId: string, nickname: string) => {
    try {
        const updatedUser: any = await prisma.user.update({
            where: {
                machine_id: machineId,
            },
            data: {
                nickname: nickname,
                modified_at: new Date(),
            }
        });
        if (!updatedUser) return null;
        const levelPercent = await getLevelPercent(machineId);

        const updatedUserGetDTO: UpdatedUserGetDTO = {
            user: {
                machineId: updatedUser.machine_id,
                nickname: updatedUser.nickname,
                latestStamp: updatedUser.latest_stamp,
                level: updatedUser.level,
                levelPercent: levelPercent,
                modifiedAt: dateConvertString(updatedUser.modified_at),
            }
        };
        return updatedUserGetDTO;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const userService = {
    signUp,
    getUser,
    updateUserNickname,
};

export default userService;