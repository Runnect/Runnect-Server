import { Request, Response, NextFunction } from "express";
import { fail } from "../constant/response";
import { rm, sc } from "../constant/";

type ObjType = {
  //index signiture error를 해결하기위해 임의로 설정한 타입
  [index: string]: string;
};

//multipart form data로 온 json 데이터를 다시 object 형태로 변화하는 미들웨어
const multiformDataConvert = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.data) return res.status(sc.BAD_REQUEST).send(fail(sc.BAD_REQUEST, rm.NULL_VALUE));
  try {
    // string 형식으로 전달된 json을 object 로 변환

    const data: ObjType = JSON.parse(req.body.data);
    //req.body에 새로운 필드를 생성해 값을 객체 값을 넣어주기
    for (let key in data) {
      req.body[key] = data[key]; //이때 값이 저장될때 string으로 저장됨. ex. distance : '2.2', ...
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(sc.INTERNAL_SERVER_ERROR).send(fail(sc.INTERNAL_SERVER_ERROR, rm.INTERNAL_SERVER_ERROR));
  }
};

export default multiformDataConvert;
