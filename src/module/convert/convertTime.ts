import dayjs from "dayjs";

export const dateConvertString = (date: Date): string => {
  const timestampString: string = dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS");

  return timestampString;
};
