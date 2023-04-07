import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const google = async (idToken: string) => {
  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: [process.env.GOOGLE_CLIENT_ID ?? "", process.env.GOOGLE_CLIENT_ID_2 ?? ""],
    }); // ' A ?? B : A가 null 또는 undefined일 경우 B를 반환한다
    const payload = ticket.getPayload();

    if (payload) {
      return { socialId: payload["sub"] as string, email: payload["email"] as string, provider: "GOOGLE" };
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const apple = async (appleToken: string) => {
  try {
    const appleUser = jwt.decode(appleToken) as any;
    console.log(appleUser);
    if (appleUser || appleUser.email_verified == "true") {
      return { socialId: appleUser["sub"], email: appleUser["email"], provider: "APPLE" };
    }
    //appleUser가 Null인경우 : 토큰자체에러
    //appleUser.email_verified가 false : 이메일이 확인되지 ㅏㅇㄴㅎ았다
    return null;
  } catch (error) {
    console.log(error);
  }
};

const kakao = async (kakaoAccessToken: string) => {
  try {
    const user = await axios({
      method: "get",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });

    return { socialId: user.data.id.toString(), email: user.data.kakao_account.email, provider: "KAKAO" };
  } catch (error) {
    console.log(error);
  }
};

const social = {
  google,
  apple,
  kakao,
};

export default social;
