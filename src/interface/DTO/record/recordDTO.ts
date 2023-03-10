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

export interface records {
  id: number;
  courseId: number;
  publicCourseId?: number;
  machineId: string;
  title: string;
  image: string;
  createdAt: string;
  distance: number;
  time: string;
  pace: string;
  departure: {
    region: string;
    city: string;
  };
}

export interface getRecordByUserResponseDTO {
  user: {
    machineId: string;
  };
  records: records[];
}
