export interface Course {
  id: number;
  image: string;
  createdAt: string;
  departure: {
    region: string;
    city: string;
  };
}

export interface CourseGetDTO {
  user: {
    id: number;
  };
  courses: Course[];
}
