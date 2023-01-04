export const pathConvertCoor = (path: string) => {
  const leftCoor = path.replace(/\(/gi, "[");
  const rightCoor = leftCoor.replace(/\)/gi, "]");

  return rightCoor;
};

// "((1),(2),(3))"
// "[[1),[2),[3))"
// "[[1],[2],[3]]"
