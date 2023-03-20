export interface scrapDTO {
  userId: number;
  publicCourseId: number;
  scrapTF: boolean;
}

export interface scrap {
  id: number;
  publicCourseId: number;
  courseId: number;
  title: string;
  image: string;
  departure: {
    region: string;
    city: string;
  };
}

export interface getScrapResponseDTO {
  user: {
    id: number;
  };
  Scraps: scrap[];
}
