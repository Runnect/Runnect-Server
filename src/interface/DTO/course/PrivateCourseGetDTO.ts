export interface PrivateCourse {
  id: number;
  image: string;
  createdAt: string;
  distance: number;
  departure: {
    region: string;
    city: string;
    town: string;
    name: string;
  };
}

export interface PrivateCourseGetDTO {
  user: {
    id: number;
  };
  privateCourses: PrivateCourse[];
}
