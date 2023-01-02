// src/modules/convertDataForm.ts

import { log } from "console";
import dayjs from "dayjs";

export const dateConvertString = (date: Date): string => {
  const now: string = dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS");

  return now;
};

export const timestampConvertString = (timestamp: Date): string => {
  const responseTimestamp: string = dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss.SSS");
  return responseTimestamp;
};
