"use strict";
// src/middleware/upload.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//사정에 맞게 커스텀 추천
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const config_1 = __importDefault(require("../config"));
const s3Config_1 = __importDefault(require("../config/s3Config"));
//? 미들웨어로 사용할 multer 모듈
const upload = (0, multer_1.default)({
    //? 실질적인 storage 는 multerS3 이용해 aws s3 로 설정
    storage: (0, multer_s3_1.default)({
        s3: s3Config_1.default,
        bucket: config_1.default.bucketName,
        //contentType 중요 : auto-content-tpye : memtype 자동으로 설정 : 이걸안하면 이미지를 보는게 아니라 다운받게됨
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
        acl: "public-read",
        //위 4설정은 s3에 어떤 설정값을 가지고 접근하는지
        //? key는 파일 이름을 지정. 버킷 내 같은 이름의 파일은 같은 파일로 인식하기 때문에 Unique하도록!
        key: function (req, file, cb) {
            //cb는 callback
            cb(null, `${Date.now()}_${file.originalname}`);
        },
    }),
});
exports.default = upload;
//# sourceMappingURL=upload.js.map