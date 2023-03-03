const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "api/user/kakao/callback",
      },
      async (accessToken: any, refreshToken: any, profile: any, done: any) => {
        console.log("kakao profile", profile);
        try {
          const exUser = await prisma.user.findUnique({
            where: { id: profile.id, provider: "kakao" },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await prisma.user.create({
              email: profile._json && profile._json.kakao_account_email,
              nick: null,
              id: profile.id,
              provider: "kakao", // 프로필사진, 이름, 성별은 DB에 저장 X
            });
            done(null, newUser); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
