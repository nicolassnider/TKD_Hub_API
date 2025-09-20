// Auto-generated (handwritten) API types for TKD Hub
// These are inferred from the API shape and can be refined as needed.

export type ID = number;

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum AttendanceStatus {
  Present = 0,
  Absent = 1,
  Excused = 2,
  Other = 3,
}

export enum BeltColor {
  White = 0,
  Yellow = 1,
  Green = 2,
  Blue = 3,
  Red = 4,
  Black = 5,
}

export interface AttendanceHistoryDto {
  id: ID;
  attendedAt: string; // ISO datetime
  status: string; // server uses string for status
  notes?: string | null;
  studentClassId: ID;
  studentName?: string;
  className?: string;
}

export interface ClassScheduleDto {
  id: ID;
  day: DayOfWeek | number;
  // backend uses TimeOnly; represent as HH:mm:ss or HH:mm string
  startTime: string;
  endTime: string;
}

export interface TrainingClassDto {
  id: ID;
  name: string;
  dojaangId: ID;
  dojaangName?: string | null;
  coachId: ID;
  coachName?: string | null;
  schedules: ClassScheduleDto[];
}

export interface CreateTrainingClassDto {
  // align with backend CreateTrainingClassDto shape where id is not required
  name: string;
  dojaangId: ID;
  coachId?: ID;
  schedules?: ClassScheduleDto[];
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  gender?: number | null;
  dateOfBirth?: string | null; // ISO date
  dojaangId?: ID;
  rankId?: ID;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  gender?: number | null;
  dateOfBirth?: string | null;
  dojaangId?: ID;
  rankId?: ID;
  joinDate?: string; // ISO date
  roleIds?: ID[];
}

export interface DojaangDto {
  id: ID;
  name: string;
  location: string;
  address: string;
  phoneNumber: string;
  email: string;
  koreanName: string;
  koreanNamePhonetic: string;
  coachId?: ID | null;
  coachName?: string | null;
  isActive: boolean;
}

export interface BlogPostDto {
  id: ID;
  title: string;
  content: string;
  authorId: ID;
  authorName?: string | null;
  isActive: boolean;
}

export interface PromotionDto {
  id: ID;
  studentId: ID;
  studentName?: string | null;
  rankId: ID;
  rankName?: string | null;
  promotionDate: string; // ISO datetime
  coachId: ID;
  notes?: string | null;
  dojaangId: ID;
}

export interface CreatePromotionDto {
  studentId: ID;
  rankId: ID;
  promotionDate: string; // ISO date
  coachId: ID;
  notes?: string | null;
  dojaangId: ID;
}

export interface UserDto {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  gender?: number | null;
  dateOfBirth?: string | null;
  dojaangId?: ID | null;
  currentRankId?: ID | null;
  joinDate?: string | null;
  roles: string[];
  managedDojaangIds?: ID[];
  isActive: boolean;
}

// Generic envelope type used by the API
export interface ApiEnvelope<T = any> {
  data?: T;
  success?: boolean;
  message?: string;
}

export default {};

// Additional DTOs and enums
export enum EventType {
  General = 0,
  Tournament = 1,
  Seminar = 2,
  Testing = 3,
  Other = 4,
}

export interface EventDto {
  id: ID;
  name: string;
  description?: string | null;
  type: number;
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
  location?: string | null;
  coachId: ID;
  dojaangId?: ID | null;
}

export interface EventAttendance {
  id: ID;
  eventId: ID;
  studentId: ID;
  attendanceDate?: string | null;
  attendanceTime?: string | null;
  status?: AttendanceStatus | string;
}

export enum MatchStatus {
  Pending = 0,
  Completed = 1,
  Cancelled = 2,
  Other = 3,
}

export interface Match {
  id: ID;
  tournamentId?: ID;
  redCornerStudentId?: ID;
  blueCornerStudentId?: ID;
  winnerStudentId?: ID;
  scoreRed?: number;
  scoreBlue?: number;
  round?: number;
  status?: MatchStatus;
  matchDate?: string;
}

export enum RegistrationStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
}

export interface StudentClassDto {
  id: ID;
  studentId: ID;
  studentName?: string | null;
  trainingClassId: ID;
  date: string; // ISO date (backend DateOnly)
  attended: boolean;
}

export interface Rank {
  id: ID;
  name: string;
  order?: number;
  description?: string;
  color?: BeltColor;
  stripeColor?: BeltColor | null;
  danLevel?: number;
}

export interface UpdateCoachManagedDojaangsDto {
  coachId: ID;
  managedDojaangIds: ID[];
}

export interface UpdateDojaangDto {
  id?: ID;
  name?: string;
  address?: string;
  location?: string;
  phoneNumber?: string;
  email?: string;
  koreanName?: string;
  koreanNamePhonetic?: string;
  coachId?: ID;
}
