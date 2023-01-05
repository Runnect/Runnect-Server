import { validationResult } from 'express-validator';
import { success, fail } from './../constant/response';
import { Request, Response } from "express";
import { rm, sc } from '../constant';
import { userService } from '../service';

/**
 * @route  POST/user/
 * @desc 회원가입
 */
const singUp = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
    }

    const machineId = req.header("machineId") as string;
    const { nickname } = req.body;

    try {
        const createdUser = await userService.signUp(machineId, nickname);

        if (!createdUser) {
            return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.SIGNUP_FAIL));
        } else if (createdUser == "success") {
            return res.status(sc.OK).send(success(sc.OK, rm.SIGNUP_SUCCESS));
        } else {
            res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, createdUser as string));
        }
    } catch (e) {
        console.error(e);
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

const getUser = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
    }

    const machineId = req.header("machineId") as string;

    try {
        const data = await userService.getUser(machineId);
        if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.READ_USER_FAIL));
        return res.status(sc.OK).send(success(sc.OK, rm.READ_USER_SUCCESS, data));
    } catch (e) {
        console.error(e);
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

/**
 * @route  PATCH/user/
 * @desc 닉네임 변경
 */
const updateUserNickname = async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const validationErrorMsg = error["errors"][0].msg;
        return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
    }

    const machineId = req.header("machineId") as string;
    const { nickname } = req.body;

    try {
        const data = await userService.updateUserNickname(machineId, nickname);

    } catch (e) {
        console.error(e);
        return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
    }
};

const userController = {
    singUp,
    getUser,
    updateUserNickname
};

export default userController;