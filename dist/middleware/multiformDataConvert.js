"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../constant/response");
const constant_1 = require("../constant/");
//multipart form data로 온 json 데이터를 다시 object 형태로 변화하는 미들웨어
const multiformDataConvert = (req, res, next) => {
    if (!req.body.data)
        return res.status(constant_1.sc.BAD_REQUEST).send((0, response_1.fail)(constant_1.sc.BAD_REQUEST, constant_1.rm.NULL_VALUE));
    try {
        // string 형식으로 전달된 json을 object 로 변환
        const data = JSON.parse(req.body.data);
        //req.body에 새로운 필드를 생성해 값을 객체 값을 넣어주기
        for (let key in data) {
            req.body[key] = data[key]; //이때 값이 저장될때 string으로 저장됨. ex. distance : '2.2', ...
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(constant_1.sc.INTERNAL_SERVER_ERROR).send((0, response_1.fail)(constant_1.sc.INTERNAL_SERVER_ERROR, constant_1.rm.INTERNAL_SERVER_ERROR));
    }
};
exports.default = multiformDataConvert;
//# sourceMappingURL=multiformDataConvert.js.map