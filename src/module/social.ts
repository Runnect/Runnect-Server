const {OAuth2Client} = require('google-auth-library');

const google = async (idToken: string) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        return { socialId: payload['sub'] as string, email: payload['email'] as string, provider: "GOOGLE" };

    } catch (error) {
        console.log(error);

    }
};

const social = {
    google,
};

export default social;