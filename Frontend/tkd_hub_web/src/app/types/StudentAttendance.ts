export type StudentAttendance = {
    id: number;
    studentId: number;
    studentName: string | null;
    trainingClassId: number;
    date: string;
    attended: boolean;
};
