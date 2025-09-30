import { ID, BaseEntity, DayOfWeek, TimeString, ISODateTime } from "./common";

// Class schedule interface
export interface ClassSchedule extends BaseEntity {
  day: DayOfWeek | number; // 0 = Sunday, 1 = Monday, etc.
  startTime: TimeString; // HH:mm format
  endTime: TimeString; // HH:mm format
  trainingClassId?: ID;
}

// Training class interface
export interface TrainingClass extends BaseEntity {
  name: string;
  dojaangId: ID;
  dojaangName?: string;
  coachId: ID;
  coachName?: string;
  schedules: ClassSchedule[];
  studentCount?: number;
  enrolledStudents?: StudentForAssignment[];
  isActive?: boolean;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

// Class creation DTO
export interface CreateTrainingClassDto {
  name: string;
  dojaangId: ID;
  coachId: ID;
  schedules: CreateClassScheduleDto[];
}

// Class update DTO
export interface UpdateTrainingClassDto {
  id: ID;
  name: string;
  dojaangId: ID;
  coachId: ID;
  schedules: CreateClassScheduleDto[];
}

// Class schedule creation DTO
export interface CreateClassScheduleDto {
  day: DayOfWeek | number;
  startTime: TimeString;
  endTime: TimeString;
}

// Student-Class relationship types
export interface StudentClass extends BaseEntity {
  studentId: ID;
  studentName?: string;
  trainingClassId: ID;
  className?: string;
  enrolledAt?: ISODateTime;
  isActive: boolean;
}

export interface StudentClassAssignment {
  studentId: ID;
  trainingClassId: ID;
}

// Extended student info for class assignments
export interface StudentForAssignment {
  id: ID;
  firstName: string;
  lastName: string;
  email?: string;
  dojaangId?: ID;
  dojaangName?: string;
  currentRankName?: string;
  fullName?: string;
  isEnrolled?: boolean;
  enrolledAt?: ISODateTime;
}

// Class analytics and management data
export interface ClassSummary extends BaseEntity {
  name: string;
  dojaangName: string;
  coachName: string;
  scheduleDisplay: string;
  enrolledStudents: number;
  maxCapacity?: number;
  nextClassDate?: ISODateTime;
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
