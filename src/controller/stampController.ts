import { StampDTO, StampGetDTO } from "../interface/DTO/stamp/StampGetDTO";
import { Request, Response } from "express";
import { rm, sc } from "../constant";
import { success, fail } from "../constant/response";
import { validationResult } from "express-validator";
import { stampService } from "../service";

const getStampByUser = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, validationErrorMsg));
  }
  const userId: number = req.body.userId;

  try {
    const stampByUser = await stampService.getStampByUser(userId);
    if (!stampByUser) {
      return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.BAD_REQUEST));
    } else {
      const stamps: StampDTO[] = stampByUser.map((sbu: any) => {
        let stamp: StampDTO = {
          id: sbu.stamp_id,
        };
        return stamp;
      });

      const stampGetDto: StampGetDTO = {
        user: {
          id: userId,
        },
        stamps: stamps,
      };

      return res.status(sc.OK).send(success(sc.OK, rm.READ_STAMP_BY_USER, stampGetDto));
    }
  } catch (error) {
    console.log(error);
    //서버내부오류
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

const stampController = { getStampByUser };
export default stampController;
