import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
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
    } catch (error) {
        
    }
};

const userService = {
    signUp,
};

export default userService;