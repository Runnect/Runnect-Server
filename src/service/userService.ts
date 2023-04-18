import { UpdatedUserGetDTO } from "../interface/DTO/user/UpdatedUserGetDTO";
import { SocialCreateRequestDTO } from "./../interface/DTO/auth/SocialCreateDTO";
import { UserGetDTO } from "../interface/DTO/user/UserGetDTO";
import { randomInitialNickname } from "../module/randomInitialNickname";
import { rm } from "../constant";
import config from "../config";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime";
import { PrismaClient } from "@prisma/client";
import { dateConvertString } from "../module/convert/convertTime";
import jwtHandler from "../module/jwtHandler";
import axios from "axios";
import qs from "qs";

const prisma = new PrismaClient();

const getUserById = async (userId: number) => {
  try {
    const getUser: any = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!getUser) return null;

    return getUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserByEmail = async (socialCreateRequestDTO: SocialCreateRequestDTO) => {
  try {
    const userByEmail = await prisma.user.findFirst({
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

const getUserByRefreshToken = async (refreshToken: string) => {
  try {
    const userByRefreshToken = await prisma.user.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });
    return userByRefreshToken;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createUser = async (socialCreateRequestDTO: SocialCreateRequestDTO, refreshToken: string) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        nickname: randomInitialNickname(),
        social_id: socialCreateRequestDTO.socialId,
        email: socialCreateRequestDTO.email,
        provider: socialCreateRequestDTO.provider,
        refresh_token: refreshToken,
      },
    });
    if (!newUser) return null;
    return newUser;
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

/*
const signUp = async (machineId: string, nickname: string) => {
  try {
    const createdUser = await prisma.user.create({
      data: {
        machine_id: machineId,
        nickname: nickname,
      },
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
*/
const getUser = async (userId: number) => {
  try {
    const getUser: any = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!getUser) return null;
    const levelPercent = await getLevelPercent(userId);
    const userGetDTO: UserGetDTO = {
      user: {
        id: getUser.id,
        nickname: getUser.nickname,
        latestStamp: getUser.latest_stamp,
        level: getUser.level,
        levelPercent: levelPercent,
      },
    };
    return userGetDTO;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getLevelPercent = async (userId: number) => {
  try {
    const userStamp = (
      await prisma.userStamp.findMany({
        where: {
          user_id: userId,
        },
      })
    ).length;
    const levelPercent = (userStamp % 4) * 25;
    return levelPercent;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateUserNickname = async (userId: number, nickname: string) => {
  try {
    const updatedUser: any = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nickname: nickname,
        modified_at: new Date(),
      },
    });
    if (!updatedUser) return null;
    const levelPercent = await getLevelPercent(userId);

    const updatedUserGetDTO: UpdatedUserGetDTO = {
      user: {
        id: updatedUser.id,
        nickname: updatedUser.nickname,
        latestStamp: updatedUser.latest_stamp,
        level: updatedUser.level,
        levelPercent: levelPercent,
        modifiedAt: dateConvertString(updatedUser.modified_at),
      },
    };
    return updatedUserGetDTO;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code == "P2025") {
        return `존재하지 않는 유저입니다.`;
      } else if (error.code == `P2002`) {
        return `중복된 닉네임입니다.`;
      }
    } else if (error instanceof PrismaClientValidationError) {
      return `${error.message}`;
    }
    throw error;
  }
};

const deleteUser = async (refreshToken: string, token?: string) => {
  try {
    const user = await getUserByRefreshToken(refreshToken);
    if (!user) return rm.NO_USER;

    //!
    console.log(user);

    if (user.provider === "APPLE") {
      //^ 애플 소셜로그인 회원의 탈퇴 경우만 request에서 토큰 받아오기
      const clientSecret = jwtHandler.createAppleJWT();
      const accessToken = token;

      const data = {
        token: accessToken,
        client_id: config.appleBundleId,
        client_secret: clientSecret,
      };

      await axios
        .post("https://appleid.apple.com/auth/revoke", qs.stringify(data), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(async (res) => {
          console.log(res);
          if (res.status == 200) {
            console.log("애플 회원탈퇴 성공");
          }
        })
        .catch((error) => {
          console.log("애플 회원탈퇴 실패", error);
          throw rm.WITHDRAW_APPLE_SOCIAL_FAIL;
        });
    }

    const data = await prisma.user.delete({
      where: {
        id: user?.id,
      },
    });
    return data.id;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code == "P2025") {
      return rm.NO_USER;
    } else {
      console.log(error);
    }
    throw error;
  }
};

const userService = {
  getUserById,
  getUserByEmail,
  getUserByRefreshToken,
  createUser,
  //signUp,
  getUser,
  updateUserNickname,
  deleteUser,
};

export default userService;
