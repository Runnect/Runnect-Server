"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkScrap = void 0;
//db의 스크랩테이블에서 가져올때 스크랩했는지 아닌지 확인
const checkScrap = (scrap) => {
    //prisma scrap output이 빈배열이거나 빈 객체면 아직 한번도 스크랩 안한것
    if (!scrap || scrap.length == 0) {
        return false;
    }
    if (scrap instanceof Array && scrap[0].scrapTF === true) {
        return true;
    }
    else if (scrap.scrapTF === true) {
        return true;
    }
    else {
        return false;
    }
};
exports.checkScrap = checkScrap;
//# sourceMappingURL=checkScrap.js.map