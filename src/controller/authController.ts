import { SocialExistingUserResponseDTO, SocialNewUserResponseDTO } from "./../interface/DTO/auth/SocialUserGetDTO";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { success, fail } from "./../constant/response";
import { rm, sc, tokenType } from "../constant";
import social from "../module/social";
import { SocialCreateRequestDTO } from "../interface/DTO/auth/SocialCreateDTO";
import { authService, userService } from "../service";
import jwtHandler from "../module/jwtHandler";
import { NewTokenGetResponseDTO } from "../interface/DTO/auth/NewTokenGetDTO";

const getSocialLoginInfo = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const { token, provider } = req.body;

  let socialUser: SocialCreateRequestDTO | null | undefined | string = null;

  try {
    switch (provider) {
      case "GOOGLE":
        socialUser = await social.google(token);

        break;
      case "APPLE":
        socialUser = await social.apple(token);
        break;

      case "KAKAO":
        socialUser = await social.kakao(token);

        break;
    }

    if (typeof socialUser === "undefined" || socialUser === null) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_SOCIAL_FAIL));
    } else if (typeof socialUser === "string") {
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, socialUser));
    }

    const existingUser = await userService.getUserByEmail(socialUser);
    const refreshToken = jwtHandler.createRefreshToken();

    // 기존 유저
    if (existingUser) {
      const updatedUser = await authService.updateRefreshToken(existingUser.id, refreshToken);
      if (!updatedUser) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_USER_FAIL));
      const accessToken = jwtHandler.sign(updatedUser.id);

      const existingUserResponseDTO: SocialExistingUserResponseDTO = {
        type: "Login",
        email: updatedUser.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(sc.OK).send(success(sc.OK, rm.LOGIN_SUCCESS, existingUserResponseDTO));
    }

    // 새로운 유저
    const newUser = await userService.createUser(socialUser, refreshToken as string);

    if (!newUser) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_USER_FAIL));
    } else if (typeof newUser === "string" || newUser instanceof String) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, newUser as string));
    } else {
      const accessToken = jwtHandler.sign(newUser.id);
      const newUserResponseDTO: SocialNewUserResponseDTO = {
        type: "Signup",
        email: newUser.email,
        nickname: newUser.nickname,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(sc.OK).send(success(sc.OK, rm.SIGNUP_SUCCESS, newUserResponseDTO));
    }
  } catch (error) {
    console.log(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const getNewToken = async (req: Request, res: Response) => {
  //토큰들이 없는지 확인 :  이미 express-validator사용
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  //헤더에 저장된 accessToken과 refreshToken 받아오기
  const accessToken = req.header("accessToken");
  const refreshToken = req.header("refreshToken");

  //일단 토큰이 존재는 함
  try {
    const decodedAccessToken = jwtHandler.verify(accessToken as string); //? jwtHandler에서 만들어둔 verify로 토큰 검사
    const decodedRefreshToken = jwtHandler.verify(refreshToken as string); //? jwtHandler에서 만들어둔 verify로 토큰 검사

    //? 토큰 에러 분기 처리(reissueToken)
    //? 1. accessToken 이상 -> 재로그인
    //? 2.1 accessToken(정상또는 만료) +refreshToken (이상 또는 만료) -> 재로그인
    //? 2.2 accessToken(정상또는 만료) +refreshToken 정상 -> 토큰 재발급
    if (decodedAccessToken === tokenType.TOKEN_INVALID || decodedRefreshToken === tokenType.TOKEN_INVALID)
      return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.INVALID_TOKEN));

    if (decodedRefreshToken === tokenType.TOKEN_EXPIRED) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.EXPIRED_ALL_TOKEN));

    // 토큰 재발급
    const user = await userService.getUserByRefreshToken(refreshToken as string);

    //refreshtoken으로 유저를 찾을 수 없을때
    if (!user) return res.status(sc.UNAUTHORIZED).send(fail(sc.UNAUTHORIZED, rm.NO_USER));

    const newAccessToken = jwtHandler.sign(user.id);

    const newTokenGetResponseDTO: NewTokenGetResponseDTO = {
      accessToken: newAccessToken,
      refreshToken: refreshToken as string,
    };

    return res.status(sc.OK).send(success(sc.OK, rm.CREATE_TOKEN_SUCCESS, newTokenGetResponseDTO));
  } catch (error) {
    console.log(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const authController = {
  getSocialLoginInfo,
  getNewToken,
};

export default authController;
