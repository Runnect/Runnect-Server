export interface UserGetDTO {
  user: {
    id: number;
    nickname: string;
    latestStamp: string;
    level: number;
    levelPercent: number;
  };
}
