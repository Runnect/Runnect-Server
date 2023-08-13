"use strict";
// src/config/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";
const envFound = dotenv_1.default.config();
if (envFound.error) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
exports.default = {
    port: parseInt(process.env.PORT, 10),
    //? 데이터베이스
    database: process.env.DATABASE_URL,
    //? JWT
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgo: process.env.JWT_ALGO,
    //? AWS
    s3AccessKey: process.env.S3_ACCESS_KEY,
    s3SecretKey: process.env.S3_SECRET_KEY,
    bucketName: process.env.S3_BUCKET,
    //?구글소셜
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientId2: process.env.GOOGLE_CLIENT_ID2,
    //?애플소셜
    appleKeyId: process.env.APPLE_KEY_ID,
    appleTeamId: process.env.APPLE_TEAM_ID,
    appleBundleId: process.env.APPLE_BUNDLE_ID,
    appleP8Path: process.env.APPLE_P8_PATH,
};
//# sourceMappingURL=index.js.map