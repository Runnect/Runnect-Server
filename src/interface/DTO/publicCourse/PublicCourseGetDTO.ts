import { bool } from "aws-sdk/clients/signer";
export interface PublicCourse {
  id: number;
  courseId: number;
  title: string;
  image: string;
  scrap?: boolean;
  departure: {
    region: string;
    city: string;
  };
}

export interface PublicCourseGetDTO {
  user: {
    id: number;
  };
  publicCourses: PublicCourse[];
}

export interface PublicCourseDetailGetDTO {
  user: {
    nickname: string;
    level: number;
    image: string;
    isNowUser: boolean;
  };
  publicCourse: {
    id: number;
    courseId: number;
    scrap: boolean;
    image: string;
    title: string;
    description: string;
    path: object;
    distance: number;
    departure: {
      region: string;
      city: string;
      town: string;
      name?: string | undefined;
    };
  };
}
