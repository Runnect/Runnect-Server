import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import { Prisma, PrismaClient } from "@prisma/client";

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

const userService = {
    signUp,
};

export default userService;