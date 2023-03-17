import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import { success, fail } from "./../constant/response";
import { rm, sc } from "../constant";
import social from "../module/social";

const getSocialLoginInfo = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
    }

    const { token, provider, idKey } = req.body;
    let socialUser;

    try {
        switch(provider) {
            case "GOOGLE":
                socialUser = await social.google(token);
                break;

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