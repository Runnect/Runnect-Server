import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { success, fail } from "./../constant/response";
import { rm, sc } from "../constant";
import social from "../module/social";
import { SocialCreateRequestDTO } from "../interface/DTO/auth/SocialCreateDTO";
import { authService } from "../service";

const getSocialLoginInfo = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
    }

    const { token, provider, idKey } = req.body;

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

        if (existingUser) {
            // 기존 유저라면
        }
        
        const newUser = await authService.createUser(socialUser);
        

    } catch (error) {
        console.log(error);
        res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

const authController = {
    getSocialLoginInfo,
};

export default authController;