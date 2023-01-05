export interface recordRequestDTO {
  machineId: string;
  courseId: number;
  publicCourseId?: number;
  title: string;
  pace: Date;
  time: Date;
}

export interface recordResponseDTO {
  record: {
    id: number;
    createdAt: string;
  };
}
