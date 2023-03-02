const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

module.exports = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_ID, // 구글 로그인에서 발급받은 REST API 키
                clientSecret: process.env.GOOGLE_SECRET,
                callbackURL: 'api/user/google/callback', // 구글 로그인 Redirect URI 경로
            },
            async(accessToken: any, refreshToken: any, profile: any, done: any) => {
                console.log('google profile: ', profile);
                try {
                    const exUser = prisma.user.findUnique({
                        where: {
                            id: profile.id,
                            provider: 'google',
                        }
                    });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const newUser = prisma.user.create({
                            data: {
                                id: profile.id,
                                provider: 'google',
                                email: profile?.email[0].value,
                                nickname: null, // nickname 처리 논의 필요
                            }
                        });
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    )
};