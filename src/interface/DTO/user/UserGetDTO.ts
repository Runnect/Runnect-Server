export interface UserGetDTO {
    user: {
        machineId: string;
        nickname: string;
        latestStamp: string;
        level: number;
        levelPercent: number;
    };
};