// Class management types for the SPA
export interface ClassSchedule {
  id: number;
  day: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface TrainingClass {
  id: number;
  name: string;
  dojaangId: number;
  dojaangName?: string;
  coachId: number;
  coachName?: string;
  schedules: ClassSchedule[];
  studentCount?: number;
  enrolledStudents?: StudentForAssignment[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTrainingClassDto {
  name: string;
  dojaangId: number;
  coachId: number;
  schedules: CreateClassScheduleDto[];
}

export interface UpdateTrainingClassDto {
  id: number;
  name: string;
  dojaangId: number;
  coachId: number;
  schedules: CreateClassScheduleDto[];
}

export interface CreateClassScheduleDto {
  day: number;
  startTime: string;
  endTime: string;
}

// Student-Class relationship types
export interface StudentClass {
  id: number;
  studentId: number;
  studentName?: string;
  trainingClassId: number;
  className?: string;
  enrolledAt?: string;
  isActive: boolean;
}

export interface StudentClassAssignment {
  studentId: number;
  trainingClassId: number;
}

// Extended student info for class assignments
export interface StudentForAssignment {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  dojaangName?: string;
  isEnrolled?: boolean;
  enrolledAt?: string;
}

// Class analytics and management data
export interface ClassSummary {
  id: number;
  name: string;
  dojaangName: string;
  coachName: string;
  scheduleDisplay: string;
  enrolledStudents: number;
  maxCapacity?: number;
  nextClassDate?: string;
}

// Day of week utilities
export const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday", short: "Sun" },
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
];

// Class permission interface
export interface ClassPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageStudents: boolean;
  canViewAttendance: boolean;
}

// Schedule conflict detection
export interface ScheduleConflict {
  conflictType: "coach" | "student" | "room";
  conflictingClassId: number;
  conflictingClassName: string;
  day: number;
  timeRange: string;
  details: string;
}
