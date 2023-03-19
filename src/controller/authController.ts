import { SocialExistingUserResponseDTO, SocialNewUserResponseDTO } from './../interface/DTO/auth/SocialUserGetDTO';
import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { success, fail } from "./../constant/response";
import { rm, sc } from "../constant";
import social from "../module/social";
import { SocialCreateRequestDTO } from "../interface/DTO/auth/SocialCreateDTO";
import { authService } from "../service";
import jwtHandler from "../module/jwtHandler";

const getSocialLoginInfo = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
    }

    const { token, provider } = req.body;

    let socialUser: SocialCreateRequestDTO | null | undefined = null;

    try {
        switch(provider) {
            case "GOOGLE":
                socialUser = await social.google(token);
                break;

        }
        //* 에러 처리 더 해줘야 함..
        if (!socialUser) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_SOCIAL_FAIL));
        }

        const existingUser = await authService.getUserByEmail(socialUser);
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
            return res.status(sc.OK).send(success(sc.OK, rm.SIGNIN_SUCCESS, existingUserResponseDTO));
        }
        
        // 새로운 유저
        const newUser = await authService.createUser(socialUser, refreshToken as string);

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

const authController = {
    getSocialLoginInfo,
};

export default authController;