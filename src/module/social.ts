const { OAuth2Client } = require("google-auth-library");
import axios from "axios";

const google = async (idToken: string) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        return { socialId: payload["sub"] as string, email: payload["email"] as string, provider: "GOOGLE" };
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
    kakao,
};

export default social;
