// src/modules/jwtHandler.ts

import jwt from "jsonwebtoken";
import { tokenType } from "../constant";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import config from "../config";
import fs from "fs";

dayjs.extend(utc);
dayjs.extend(timezone);

//* 받아온 userId를 담는 access token 생성
const sign = (userId: number) => {
  const payload = {
    userId,
  };
  //sign 메소드는 첫인자 payload, 두번째 secretkey 세번째 option : 토큰의 유통기한
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "2h" });

  return accessToken;
};

//* refreshToken 발급
const createRefreshToken = () => {
  const refreshToken = jwt.sign({}, process.env.JWT_SECRET as string, { expiresIn: "14d" });
  return refreshToken;
};

//* token 검사!
const verify = (token: string) => {
  let decoded: string | jwt.JwtPayload | undefined;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "jwt expired") {
        return tokenType.TOKEN_EXPIRED;
      } else if (error.message === "invalid token") {
        return tokenType.TOKEN_INVALID;
      } else {
        return tokenType.TOKEN_INVALID;
      }
    } else {
      console.log(error);
    }
  }

  return decoded;
};

const createAppleJWT = () => {
  const p8Key = fs.readFileSync(config.appleP8Path, "utf8");

  const payload = {
    iss: config.appleTeamId,
    iat: dayjs()
      .tz()
      .unix(),
    exp:
      dayjs()
        .tz()
        .unix() + 120,
    aud: "https://appleid.apple.com",
    sub: config.appleBundleId,
  };

  const appleJWT = jwt.sign(payload, p8Key, {
    algorithm: "ES256",
    header: {
      alg: "ES256",
      kid: config.appleKeyId,
    },
  });

  return appleJWT;
};

export default {
  sign,
  verify,
  createRefreshToken,
  createAppleJWT,
};
