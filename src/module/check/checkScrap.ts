import { bool } from "aws-sdk/clients/signer";

//db의 스크랩테이블에서 가져올때 스크랩했는지 아닌지 확인
export const checkScrap = (scrap: any): boolean => {
  //prisma scrap output이 빈배열이거나 빈 객체면 아직 한번도 스크랩 안한것
  if (!scrap || scrap.length == 0) {
    return false;
  }
  // prisma scrap output은 빈 배열 형태안에 객체가 있음. 만약 스크랩기록이있어도 scrapTF가 false면 현재 스크랩 안된것
  else if (scrap[0].scrapTF === false) {
    return false;
  } else {
    return true;
  }
};
