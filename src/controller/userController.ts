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



const userController = {
    singUp,
};

export default userController;