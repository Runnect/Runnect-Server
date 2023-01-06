export const pathConvertCoor = (path: string) => {
  const leftCoor = path.replace(/\(/gi, "[");
  const rightCoor = leftCoor
    .replace(/\)/gi, "]")
    .substring(1, leftCoor.length - 1); // "[1,2],[3,4],[5,6]"
  const coor = eval("[" + rightCoor + "]");
  return coor;
};

// "((1,2),(3,4),(5,6))"
// "[1,2],[3,4],[5,6]"
// [[1,2],[3,4],[5,6]]
