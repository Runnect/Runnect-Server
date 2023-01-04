export interface PublicCourse {
  id: number;
  courseId: number;
  title: string;
  image: string;
  scarp?: boolean;
  departure: {
    region: string;
    city: string;
  };
}

export interface PublicCourseGetDTO {
  user: {
    machineId: string;
  };
  publicCourses: PublicCourse[];
}
