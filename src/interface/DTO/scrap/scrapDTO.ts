export interface scrapDTO {
  machineId: string;
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
    machineId: string;
  };
  Scraps: scrap[];
}
