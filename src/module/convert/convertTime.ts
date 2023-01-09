import dayjs from "dayjs";

export const dateConvertString = (date: Date): string => {
  const timestampString: string = dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS");

  return timestampString;
};

export const timestampConvertString = (timestamp: Date): string => {
  const responseTimestamp: string = dayjs(timestamp).format(
    "YYYY-MM-DD HH:mm:ss.SSS"
  );
  return responseTimestamp;
};

export const stringConvertTime = (string: string) => {
  var time = new Date();
  var [hours, minutes, seconds] = string.split(":");
  time.setHours(+hours);
  time.setMinutes(+minutes);
  time.setSeconds(+seconds);

  return time;
};
