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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const randomInitialNickname_1 = require("../module/randomInitialNickname");
const constant_1 = require("../constant");
const config_1 = __importDefault(require("../config"));
const runtime_1 = require("@prisma/client/runtime");
const client_1 = require("@prisma/client");
const convertTime_1 = require("../module/convert/convertTime");
const jwtHandler_1 = __importDefault(require("../module/jwtHandler"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const prisma = new client_1.PrismaClient();
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!getUser)
            return null;
        return getUser;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const getUserByEmail = (socialCreateRequestDTO) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userByEmail = yield prisma.user.findFirst({
            where: {
                AND: [{ email: socialCreateRequestDTO.email }, { provider: socialCreateRequestDTO.provider }],
            },
        });
        return userByEmail;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const getUserByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userByRefreshToken = yield prisma.user.findFirst({
            where: {
                refresh_token: refreshToken,
            },
        });
        return userByRefreshToken;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
const createUser = (socialCreateRequestDTO, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield prisma.user.create({
            data: {
                nickname: (0, randomInitialNickname_1.randomInitialNickname)(),
                social_id: socialCreateRequestDTO.socialId,
                email: socialCreateRequestDTO.email,
                provider: socialCreateRequestDTO.provider,
                refresh_token: refreshToken,
            },
        });
        if (!newUser)
            return null;
        return newUser;
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
const getUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getUser = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!getUser)
            return null;
        const levelPercent = yield getLevelPercent(userId);
        const userGetDTO = {
            user: {
                id: getUser.id,
                email: getUser.email,
                provider: getUser.provider,
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
const getLevelPercent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userStamp = (yield prisma.userStamp.findMany({
            where: {
                user_id: userId,
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
const updateUserNickname = (userId, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                nickname: nickname,
                modified_at: new Date(),
            },
        });
        if (!updatedUser)
            return null;
        const levelPercent = yield getLevelPercent(userId);
        const updatedUserGetDTO = {
            user: {
                id: updatedUser.id,
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
const deleteUser = (refreshToken, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield getUserByRefreshToken(refreshToken);
        if (!user)
            return constant_1.rm.NO_USER;
        //!
        console.log(user);
        if (user.provider === "APPLE") {
            //^ 애플 소셜로그인 회원의 탈퇴 경우만 request에서 토큰 받아오기
            const clientSecret = jwtHandler_1.default.createAppleJWT();
            const accessToken = token;
            const data = {
                token: accessToken,
                client_id: config_1.default.appleBundleId,
                client_secret: clientSecret,
            };
            yield axios_1.default
                .post("https://appleid.apple.com/auth/revoke", qs_1.default.stringify(data), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(res);
                if (res.status == 200) {
                    console.log("애플 회원탈퇴 성공");
                }
            }))
                .catch((error) => {
                console.log("애플 회원탈퇴 실패", error);
                throw constant_1.rm.WITHDRAW_APPLE_SOCIAL_FAIL;
            });
        }
        const data = yield prisma.user.delete({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        return data.id;
    }
    catch (error) {
        if (error instanceof runtime_1.PrismaClientKnownRequestError && error.code == "P2025") {
            return constant_1.rm.NO_USER;
        }
        else {
            console.log(error);
        }
        throw error;
    }
});
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
exports.default = userService;
//# sourceMappingURL=userService.js.map