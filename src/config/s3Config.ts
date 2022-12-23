// src/config/s3Config.ts

import { S3Client } from "@aws-sdk/client-s3";
import config from ".";

const s3: S3Client = new S3Client({
  region: "ap-northeast-2", //아시아 태평양 서울 리전
  credentials: {
    accessKeyId: config.s3AccessKey,
    secretAccessKey: config.s3SecretKey,
  },
});

export default s3;
