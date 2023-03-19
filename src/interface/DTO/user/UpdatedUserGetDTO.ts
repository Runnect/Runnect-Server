export interface UpdatedUserGetDTO {
  user: {
    id: number;
    nickname: string;
    latestStamp: string;
    level: number;
    levelPercent: number;
    modifiedAt: string;
  };
}
