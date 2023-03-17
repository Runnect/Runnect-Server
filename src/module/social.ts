const {OAuth2Client} = require('google-auth-library');

const google = async (idToken: string) => {
    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const userid = payload['sub'];
        const email = payload.getEmail();

        return email; //* return 값 정하기

        // const verify = async () => {
        //     const ticket = await client.verifyIdToken({
        //         idToken: idToken,
        //         audience: process.env.GOOGLE_CLIENT_ID,
        //     });
        //     const payload = ticket.getPayload();

        //     const userid = payload['sub'];
        //     const email = payload.getEmail();

        //     return email; //* return 값 정하기
        // };
        // verify().catch(console.error);

    } catch (error) {
        console.log(error);

    }
};

const social = {
    google,
};

export default social;