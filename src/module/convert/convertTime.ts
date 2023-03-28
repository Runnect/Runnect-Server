import dayjs from "dayjs";

export const dateConvertString = (date: Date | undefined): string => {
  const timestampString: string = dayjs(date).format("YYYY-MM-DD HH:mm:ss.SSS");

  return timestampString;
}; //DB에서 저장되고 출력되는 DATE 타입의 객체를 response로 보내줄때 string 으로 변경

export const stringConvertTime = (string: string) => {
  var time = new Date();
  var [hours, minutes, seconds] = string.split(":");
  time.setHours(+hours);
  time.setMinutes(+minutes);
  time.setSeconds(+seconds);

  return time;
}; //request의 string 형태의 시간정보를 DB에 저장할수있도록 DATE 타입으로 변경
