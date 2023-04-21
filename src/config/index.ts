// src/config/index.ts

import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT as string, 10) as number,

  //? 데이터베이스
  database: process.env.DATABASE_URL as string,

  //? JWT
  jwtSecret: process.env.JWT_SECRET as string,
  jwtAlgo: process.env.JWT_ALGO as string,

  //? AWS
  s3AccessKey: process.env.S3_ACCESS_KEY as string,
  s3SecretKey: process.env.S3_SECRET_KEY as string,
  bucketName: process.env.S3_BUCKET as string,

  //?구글소셜
  googleClientId: process.env.GOOGLE_CLIENT_ID as string,
  googleClientId2: process.env.GOOGLE_CLIENT_ID2 as string,

  //?애플소셜
  appleKeyId: process.env.APPLE_KEY_ID as string,
  appleTeamId: process.env.APPLE_TEAM_ID as string,
  appleBundleId: process.env.APPLE_BUNDLE_ID as string,
  appleP8Path: process.env.APPLE_P8_PATH as string,
};
