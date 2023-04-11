export interface UpdatePublicCourseDTO {
  title: string;
  description: string;
}

export interface UpdatePublicCourseResponseDTO {
  publicCourse: { id: number; title: string; description: string };
}
