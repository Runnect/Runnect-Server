export interface CourseCreateDTO {
  userId: number;
  path: string;
  distance: number;
  region: string;
  city: string;
  town: string;
  detail?: string;
  name?: string;
  image: string;
}
