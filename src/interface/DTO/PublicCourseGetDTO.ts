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

export interface PublicCourseDetailGetDTO {
  user: {
    nickname: string;
    level: number;
    image: string;
  };
  publicCourse: {
    id: number;
    courseId: number;
    scrap: boolean;
    image: string;
    title: string;
    description: string;
    distance: number;
    departure: {
      region: string;
      city: string;
      town: string;
      detail?: string;
      name?: string;
    };
  };
}
