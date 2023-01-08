import { StampDTO, StampGetDTO } from "./../interface/DTO/StampGetDTO";
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
  const machineId = req.header("machineId") as string;

  try {
    const stampByUser = await stampService.getStampByUser(machineId);
    if (!stampByUser || stampByUser.length == 0) {
      return res.status(sc.OK).send(success(sc.OK, rm.READ_STAMP_BY_USER, stampByUser));
    } else {
      const stamps: StampDTO[] = stampByUser.map((sbu: any) => {
        let stamp: StampDTO = {
          id: sbu.stamp_id,
        };
        return stamp;
      });

      const stampGetDto: StampGetDTO = {
        user: {
          machineId: machineId,
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
