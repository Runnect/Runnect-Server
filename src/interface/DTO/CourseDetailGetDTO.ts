export interface CourseDetailGetDTO {
    "user": {
        "machineId": string;
    };
    "course": {
        "id": number;
        "createdAt": string;
        "path": string; // 나중에 바꿀 예정
        "distance": number;
        "departure": {
            "region": string;
            "city": string;
            "town": string;
            "name": string;
        };
    };
}