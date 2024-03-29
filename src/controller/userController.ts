import { validationResult } from "express-validator";
import { success, fail } from "./../constant/response";
import { Request, Response } from "express";
import { rm, sc } from "../constant";
import { userService } from "../service";

/**
 * @route  POST/user/
 * @desc 회원가입
 
const signUp = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const { nickname, userId } = req.body;

  try {
    const createdUser = await userService.signUp(userId, nickname);

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
*/
const getUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }

  const userId: number = req.body.userId;

  try {
    const data = await userService.getUser(userId);
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

  const { nickname, userId } = req.body;

  try {
    const data = await userService.updateUserNickname(userId, nickname);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.UPDATE_USER_FAIL));
    else if (typeof data == "string") {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, data as string));
    }
    return res.status(sc.OK).send(success(sc.OK, rm.UPDATE_USER_SUCCESS, data));
  } catch (e) {
    console.error(e);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const refreshToken = req.header("refreshToken");
  //! 애플의 경우만 헤더에 appleAccessToken  보내기
  const appleAccessToken = req.header("appleAccessToken");

  try {
    const data = await userService.deleteUser(refreshToken!, appleAccessToken);
    if (!data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.DELETE_USER_FAIL));
    else if (typeof data == "string") return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, data));
    return res.status(sc.OK).send(success(sc.OK, rm.DELETE_USER_SUCCESS, { deletedUserId: data }));
  } catch (e) {
    console.log(e);
    return res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const userController = {
  //signUp,
  getUser,
  updateUserNickname,
  deleteUser,
};

export default userController;
