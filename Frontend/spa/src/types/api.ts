/**
 * TKD Hub API Types - Consolidated and aligned with backend DTOs
 * Generated from .NET backend DTOs to ensure type safety and consistency
 */

// ============================================================================
// COMMON TYPES
// ============================================================================

export type ID = number;
export type ISODate = string; // YYYY-MM-DD format
export type ISODateTime = string; // ISO 8601 datetime format
export type TimeOnly = string; // HH:mm:ss format (from .NET TimeOnly)

// ============================================================================
// ENUMS (aligned with backend Domain.Enums)
// ============================================================================

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

// Backend: Present, Absent, Late, Excused
export enum AttendanceStatus {
  Present = 0,
  Absent = 1,
  Late = 2,
  Excused = 3,
}

// Backend: White, Yellow, Green, Blue, Red, Black
export enum BeltColor {
  White = 0,
  Yellow = 1,
  Green = 2,
  Blue = 3,
  Red = 4,
  Black = 5,
}

// Backend: MALE, FEMALE, OTHER
export enum Gender {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}

export enum EventType {
  General = 0,
  Tournament = 1,
  Seminar = 2,
  Testing = 3,
  Other = 4,
}

export enum MatchStatus {
  Pending = 0,
  Completed = 1,
  Cancelled = 2,
  Other = 3,
}

export enum RegistrationStatus {
  Pending = 0,
  Confirmed = 1,
  Cancelled = 2,
}

// ============================================================================
// USER DTOs
// ============================================================================

export interface UserDto {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: number | Gender | null; // API returns number (0=unspecified, 1=male, 2=female)
  dateOfBirth?: ISODateTime | null;
  dojaangId: number;
  dojaangName?: string;
  currentRankId?: number;
  currentRankName?: string;
  joinDate?: ISODateTime | null;
  roles?: string[];
  managedDojaangIds?: number[];
  isActive: boolean;
  beltLevel?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  rankId?: ID | null; // Renamed from CurrentRankId to RankId
  joinDate?: ISODateTime | null;
  roleIds: ID[]; // Assign roles on creation
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  rankId?: ID | null;
}

export interface UpdateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  rankId?: ID | null;
  joinDate?: ISODateTime | null;
  isActive?: boolean | null;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  emergencyContact: string;
  emergencyPhone: string;
  currentRankId: ID | "";
  dojaangId: ID | "";
  isActive: boolean;
  joinDate: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  medicalNotes: string;
}

export interface Student {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: ISODateTime | null;
  gender?: Gender | null;
  emergencyContact?: string;
  emergencyPhone?: string;
  currentRank?: Rank | null;
  currentRankId?: ID | null;
  dojaang?: DojaangDto | null;
  dojaangId?: ID | null;
  isActive: boolean;
  joinDate?: ISODateTime | null;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  medicalNotes?: string;
  roles?: UserRoleDto[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface UpsertCoachDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  rankId?: ID | null;
}

export interface UserRoleDto {
  id: ID;
  name: string;
}

export interface UpdateCoachManagedDojaangsDto {
  coachId: ID;
  managedDojaangIds: ID[];
}

// ============================================================================
// TRAINING CLASS DTOs
// ============================================================================

export interface TrainingClassDto {
  id: ID;
  name: string;
  description?: string | null;
  dojaangId: ID;
  dojaangName?: string | null;
  coachId: ID;
  coachName?: string | null;
  capacity?: number | null;
  enrolledStudentsCount: number;
  schedule?: string | null; // Computed field for display
  schedules: ClassScheduleDto[];
}

export interface CreateTrainingClassDto {
  id: ID;
  name: string;
  dojaangId: ID;
  dojaangName?: string | null;
  coachId: ID;
  coachName?: string | null;
  schedules: ClassScheduleDto[];
}

export interface ClassScheduleDto {
  id: ID;
  day: DayOfWeek;
  startTime: TimeOnly;
  endTime: TimeOnly;
}

export interface StudentClassDto {
  id: ID;
  studentId: ID;
  studentName?: string | null;
  trainingClassId: ID;
  date: ISODate; // Backend uses DateOnly
  attended: boolean;
}

export interface AttendanceHistoryDto {
  id: ID;
  attendedAt: ISODateTime;
  status: string;
  notes?: string | null;
  studentClassId: ID;
  studentName?: string | null;
  className?: string | null;
}

// ============================================================================
// DOJAANG DTOs
// ============================================================================

export interface DojaangDto {
  id: ID;
  name: string;
  location: string;
  address: string;
  phoneNumber: string;
  email: string;
  koreanName: string;
  koreanNamePhonetic: string;
  coachId: ID;
  coachName: string;
  isActive: boolean;
}

export interface ManagedDojaangDto {
  id: ID;
  name: string;
}

export interface CreateDojaangDto {
  name: string;
  address: string;
  location: string;
  phoneNumber: string;
  email: string;
  koreanName?: string;
  koreanNamePhonetic?: string;
  coachId?: ID;
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

// ============================================================================
// OTHER DTOs
// ============================================================================

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
  promotionDate: ISODateTime;
  coachId: ID;
  notes?: string | null;
  dojaangId: ID;
}

export interface CreatePromotionDto {
  studentId: ID;
  rankId: ID;
  promotionDate: ISODate;
  coachId: ID;
  notes?: string | null;
  dojaangId: ID;
}

export interface EventDto {
  id: ID;
  name: string;
  description?: string | null;
  type: EventType;
  startDate: ISODateTime;
  endDate: ISODateTime;
  location?: string | null;
  coachId: ID;
  dojaangId?: ID | null;
}

export interface EventAttendance {
  id: ID;
  eventId: ID;
  studentId: ID;
  attendanceDate?: ISODateTime | null;
  attendanceTime?: string | null;
  status?: AttendanceStatus;
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
  matchDate?: ISODateTime;
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

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  data?: T;
  success?: boolean;
  message?: string;
  errors?: string[];
}

// Legacy alias for backwards compatibility
export interface ApiEnvelope<T = any> extends ApiResponse<T> {}

// ============================================================================
// AUTHENTICATION DTOs
// ============================================================================

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  gender?: Gender;
  dateOfBirth?: ISODateTime;
  dojaangId?: ID;
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PageRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  searchTerm?: string;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  roles?: string[];
  isPublic?: boolean;
}

export default {};
