import { SocialCreateRequestDTO } from "./../interface/DTO/auth/SocialCreateDTO";
import { PrismaClient, User } from "@prisma/client";
import { randomInitialNickname } from "../module/randomInitialNickname";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";

const prisma = new PrismaClient();

const updateRefreshToken = async (userId: number, refreshToken: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });
    return updatedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const authService = {
  updateRefreshToken,
};

export default authService;
