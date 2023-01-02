export interface PublicCourseCreateRequestDTO {
  courseId: string;
  title: string;
  description: string;
}

export interface PublicCourseCreateResponseDTO {
  publicCourse: {
    id: number;
    createdAt: string;
  };
}
