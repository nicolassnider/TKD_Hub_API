export type StudentClass = {
  id: number;
  studentId: number;
  studentName?: string;
  trainingClassId: number;
  date: string; // DateOnly as string, e.g., "2024-06-10"
  attended: boolean;
};
