export interface CourseDetailGetDTO {
  user: {
    id: number;
  };
  course: {
    id: number;
    createdAt: string;
    path: object; // 나중에 바꿀 예정
    distance: number;
    image: string;
    departure: {
      region: string;
      city: string;
      town: string;
      name: string;
    };
  };
}
