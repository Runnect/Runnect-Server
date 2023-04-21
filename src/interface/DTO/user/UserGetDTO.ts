export interface UserGetDTO {
  user: {
    id: number;
    email: string;
    provider: string;
    nickname: string;
    latestStamp: string;
    level: number;
    levelPercent: number;
  };
}
