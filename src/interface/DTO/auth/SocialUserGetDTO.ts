export interface SocialExistingUserResponseDTO {
    type: string;
    email: string;
    accessToken: string;
    refreshToken: string;
}

export interface SocialNewUserResponseDTO {
    type: string;
    email: string;
    nickname: string;
    accessToken: string;
    refreshToken: string;
}