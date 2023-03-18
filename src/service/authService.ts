import { SocialCreateRequestDTO } from './../interface/DTO/auth/SocialCreateDTO';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getUserByEmail = async (socialCreateRequestDTO: SocialCreateRequestDTO) => {
    try {
        const userByEmail = await prisma.user.findMany({
            where: {
                AND: [{ email: socialCreateRequestDTO.email }, { provider: socialCreateRequestDTO.provider }],
            },
        });
        return userByEmail;
    } catch (error) {
        console.log(error);
        throw error;
    }
};


const createUser = async (socialCreateRequestDTO: SocialCreateRequestDTO) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                nickname: "바꾸기바꾸기",
                social_id: socialCreateRequestDTO.socialId,
                email: socialCreateRequestDTO.email,
                provider: socialCreateRequestDTO.provider,
            },
        });
        return newUser;
    } catch (error) {
        
    }
};

const authService = {
    getUserByEmail,
    createUser,
};

export default authService;