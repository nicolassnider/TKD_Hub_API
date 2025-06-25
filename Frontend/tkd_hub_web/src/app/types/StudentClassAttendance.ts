import { AttendanceStatus } from "../enums/AttendanceStatus";

export type StudentClassAttendance = {
    id: number;
    studentClassId: number;
    attendedAt: string; // ISO date string
    status: AttendanceStatus;
    notes?: string | null;
    // Optionally add: studentClass?: StudentClass;
};
