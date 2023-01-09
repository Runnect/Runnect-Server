export interface CourseCreateDTO {
  machineId: string;
  path: string;
  distance: number;
  region: string;
  city: string;
  town: string;
  detail?: string;
  name?: string;
  image: string;
}
