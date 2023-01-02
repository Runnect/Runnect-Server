// src/modules/convertDataForm.ts

import dayjs from "dayjs";

export const convertDateForm = (date: Date): string => {
  const now: string = dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS");

  return now;
};
