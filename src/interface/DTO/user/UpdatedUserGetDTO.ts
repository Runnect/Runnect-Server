export interface UpdatedUserGetDTO {
    user: {
        machineId: string;
        nickname: string;
        latestStamp: string;
        level: number;
        levelPercent: number;
        modifiedAt: string;
    };
};