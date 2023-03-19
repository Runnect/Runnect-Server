// src/middleware/auth.ts

import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { rm, sc } from "../constant";
import { fail } from "../constant/response";
import tokenType from "../constant/tokenType";
import jwtHandler from "../module/jwtHandler";
import { userService } from "../service";

export default async (req: Request, res: Response, next: NextFunction) => {
  //헤더에 저장된 accessToken과 refreshToken 받아오기
  const accessToken = req.header("accessToken");
  const refreshToken = req.header("refreshToken");

  //토큰들이 없는지 확인
  if (!accessToken || !refreshToken) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EMPTY_TOKEN));

  //일단 토큰이 존재는함
  try {
    const decodedAccessToken = jwtHandler.verify(accessToken as string); //? jwtHandler에서 만들어둔 verify로 토큰 검사

    //? 토큰 에러 분기 처리(auth)
    //? 1. accessToken 정상 -> 이 회원이 우리회원이 맞는지 검사(auth)
    //? 2. accessToken 만료 또는 이상 -> 재로그인 또는 토큰 재발급

    //? 토큰 에러 분기 처리(reissueToken)
    //? 1. accessToken 이상 -> 재로그인
    //? 2.1 accessToken(정상또는 만료) +refreshToken (이상 또는 만료) -> 재로그인
    //? 2.2 accessToken(정상또는 만료) +refreshToken 정상 -> 토큰 재발급

    if (decodedAccessToken === tokenType.TOKEN_EXPIRED) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_TOKEN));
    if (decodedAccessToken === tokenType.TOKEN_INVALID) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));

    //? decode한 후 담겨있는 userId를 꺼내옴
    const userId: number = (decodedAccessToken as JwtPayload).userId;
    if (!userId) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));

    //? 얻어낸 userId가 우리 회원인지 검사
    const existingUser = await userService.getUserById(userId);
    if (!existingUser) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.NO_USER));

    //? 얻어낸 userId 를 Request Body 내 userId 필드에 담고, 다음 미들웨어로 넘김( next() )
    req.body.userId = existingUser.id;
    //req.body의 필드를 지금 하나 생성하는 것

    next();
  } catch (error) {
    console.log(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};
