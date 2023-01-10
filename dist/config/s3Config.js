"use strict";
// src/config/s3Config.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const _1 = __importDefault(require("."));
const s3 = new client_s3_1.S3Client({
    region: "ap-northeast-2",
    credentials: {
        accessKeyId: _1.default.s3AccessKey,
        secretAccessKey: _1.default.s3SecretKey,
    },
});
exports.default = s3;
//# sourceMappingURL=s3Config.js.map