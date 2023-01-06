// { "path" : [{"lat" : "23.333", "long" : "45.444"},{"lat" : "23.22", "long" : "45.222"}]}의 형태로 req

export const coorConvertPath = (coor: object[]) => {
  const pathArray: object[] = coor.map((element: any) => {
    return [element.lat * 1, element.long * 1]; //string을 number로 바꾸기 위해 *1
  });
  // pathArray는 [[23.333,45.444],[23.22,45.222]] (이중배열 모양)
  let path = ("[[" + pathArray.join("],[") + "]]")
    .replace(/\[/gi, "(")
    .replace(/\]/gi, ")");
  // pathArray를 그대로 string(대괄호 포함)으로 만들고 소괄호로 replace
  return path;
};
