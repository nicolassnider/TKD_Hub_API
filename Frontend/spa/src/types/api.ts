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

// Backend: MALE, FEMALE, OTHER (0-indexed from C# enum)
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
// UTILITY ARRAYS & OPTIONS
// ============================================================================

export const attendanceStatusOptions = [
  { value: AttendanceStatus.Present, label: "Present", color: "success" },
  { value: AttendanceStatus.Absent, label: "Absent", color: "error" },
  { value: AttendanceStatus.Late, label: "Late", color: "warning" },
  { value: AttendanceStatus.Excused, label: "Excused", color: "info" },
];

export const DAYS_OF_WEEK = [
  { value: DayOfWeek.Sunday, label: "Sunday", short: "Sun" },
  { value: DayOfWeek.Monday, label: "Monday", short: "Mon" },
  { value: DayOfWeek.Tuesday, label: "Tuesday", short: "Tue" },
  { value: DayOfWeek.Wednesday, label: "Wednesday", short: "Wed" },
  { value: DayOfWeek.Thursday, label: "Thursday", short: "Thu" },
  { value: DayOfWeek.Friday, label: "Friday", short: "Fri" },
  { value: DayOfWeek.Saturday, label: "Saturday", short: "Sat" },
];

// Alias for TrainingClass - using TrainingClassDto as base
export type TrainingClass = TrainingClassDto;

// Training Class update DTO
export interface UpdateTrainingClassDto {
  id: ID;
  name?: string;
  description?: string | null;
  dojaangId?: ID;
  coachId?: ID;
  capacity?: number | null;
  schedules?: CreateClassScheduleDto[];
}

// Schedule conflict type
export interface ScheduleConflict {
  day: DayOfWeek;
  startTime: TimeOnly;
  endTime: TimeOnly;
  conflictingClassId: ID;
  conflictingClassName: string;
  conflictType: string;
  details: string;
  timeRange: string;
}

// Student for Assignment type
export interface StudentForAssignment {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  currentRankName?: string | null;
  dojaangName?: string | null;
  enrolledAt?: ISODateTime | null;
}

// Context and permissions types
export interface BlogPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
  canView: boolean;
}

export interface ClassPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageStudents: boolean;
  canTakeAttendance: boolean;
  canViewAttendance: boolean;
}

export interface ProfilePermissions {
  canEdit: boolean;
  canViewPrivate: boolean;
  canManagePayments: boolean;
  canEditProfile: boolean;
}

// Profile-related types
export type UserProfile = ProfileDto;
export type CoachProfile = ProfileDto;
export type StudentProfile = ProfileDto;
export type CombinedProfile = ProfileDto;
export type ProfileUpdateData = ProfileFormData;

// Class enrollment and stats
export interface ClassEnrollment {
  id: ID;
  studentId: ID;
  classId: ID;
  enrollmentDate: ISODateTime;
  isActive: boolean;
}

export interface ProfileStats {
  classesAttended: number;
  totalClasses: number;
  attendanceRate: number;
  currentStreak: number;
  totalStudents?: number;
  upcomingClasses?: any[];
}

// Payment-related
export interface MercadopagoPayment {
  id: ID;
  amount: number;
  status: string;
  dueDate: ISODateTime;
  description?: string;
  paymentUrl?: string;
}

// Type aliases for context compatibility
export type StudentClass = StudentClassDto;
export type StudentClassAssignment = StudentForAssignment;

// ============================================================================
// USER DTOs
// ============================================================================

export interface UserDto {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  currentRankId?: ID | null;
  joinDate?: ISODateTime | null;
  roles: string[];
  managedDojaangIds: ID[];
  isActive: boolean;
  // Extended properties for student management
  dojaangName?: string | null;
  currentRankName?: string | null;
  currentRank?: RankDto | null;
  dojaang?: DojaangDto | null;
  beltLevel?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  parentName?: string | null;
  parentEmail?: string | null;
  parentPhone?: string | null;
  medicalNotes?: string | null;
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
  // Form compatibility properties
  currentRankId?: ID | null;
  roles?: string[];
  isActive?: boolean;
}

// Form-specific user data type that makes roleIds optional for form initialization
export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: string | null; // Forms use string dates
  dojaangId?: ID | null;
  currentRankId?: ID | null;
  roles: string[]; // Required for forms
  roleIds?: ID[]; // Optional for forms, will be computed from roles
  isActive: boolean;
  id?: number; // For editing existing users
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
  id: ID;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  currentRankId?: ID | null;
  joinDate?: ISODateTime | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  parentName?: string | null;
  parentEmail?: string | null;
  parentPhone?: string | null;
  medicalNotes?: string | null;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  dojaangId?: ID | null | string;
  rankId?: ID | null;
  currentRankId?: ID | null;
  joinDate?: string | null;
  emergencyContact: string;
  emergencyPhone: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  medicalNotes: string;
  isActive?: boolean;
}

export interface UpdateUserDto {
  id: ID;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  currentRankId?: ID | null;
  joinDate?: ISODateTime | null;
  // Form compatibility properties
  roles?: string[];
  isActive?: boolean;
}

export interface UserRoleDto {
  id: ID;
  userId: ID;
  roleId: ID;
  roleName: string;
}

// ============================================================================
// COACH DTOs
// ============================================================================

export interface CoachDto {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  dojaangName?: string | null;
  rankId?: ID | null;
  joinDate?: ISODateTime | null;
  managedDojaangIds: ID[];
  isActive: boolean;
  hireDate?: ISODateTime | null;
  specializations?: string[] | null;
  bio?: string | null;
  certifications?: string | null;
}

export interface CoachFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  dojaangId?: ID | string | null;
  rankId?: ID | null;
  joinDate?: string | null;
  managedDojaangIds?: ID[];
  hireDate?: string | null;
  specializations?: string;
  bio?: string;
  certifications?: string;
  isActive?: boolean;
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
  // Compatibility properties
  enrolledStudents?: UserDto[] | null;
  studentCount?: number;
}

export interface CreateTrainingClassDto {
  name: string;
  description?: string | null;
  dojaangId: ID;
  coachId: ID;
  capacity?: number | null;
  schedules: CreateClassScheduleDto[];
}

export interface ClassScheduleDto {
  id: ID;
  day: DayOfWeek;
  startTime: TimeOnly;
  endTime: TimeOnly;
}

export interface CreateClassScheduleDto {
  day: DayOfWeek;
  startTime: TimeOnly;
  endTime: TimeOnly;
}

export interface StudentClassDto {
  id: ID;
  studentId: ID;
  studentName?: string | null;
  trainingClassId: ID;
  className?: string | null;
  enrollmentDate: ISODateTime;
  isActive: boolean;
}

export interface AttendanceHistoryDto {
  id: ID;
  studentId: ID;
  studentName?: string | null;
  trainingClassId: ID;
  className?: string | null;
  attendanceDate: ISODate;
  status: AttendanceStatus;
  notes?: string | null;
  attendedAt?: ISODateTime | null;
}

export interface AttendanceRecord {
  id: ID;
  studentId: ID;
  studentName?: string | null;
  trainingClassId: ID;
  className?: string | null;
  attendanceDate: ISODate;
  status: AttendanceStatus;
  notes?: string | null;
  attendedAt?: ISODateTime | null;
  studentClassId?: ID;
}

// Alias for Student - using UserDto as base
export type Student = UserDto;

// Legacy User types for backward compatibility
export type User = UserDto;
export type CreateUserRequest = CreateUserDto;
export type UpdateUserRequest = UpdateUserDto;

// Legacy Dojaang type
export type Dojaang = DojaangDto;

// Blog-related types
export interface BlogPost {
  id: ID;
  title: string;
  content: string;
  authorId: ID;
  authorName?: string | null;
  isActive: boolean;
  createdDate: ISODateTime;
  updatedDate: ISODateTime;
}

// Payment-related types
export interface PaymentInfo {
  id: ID;
  amount: number;
  currency: string;
  description?: string | null;
  paymentDate: ISODateTime;
  status: string;
  method: string;
  dueDate?: ISODateTime | null;
  transactionId?: string | null;
  paymentMethod?: string | null;
  className?: string | null;
}

export interface PaymentFormData {
  amount: number;
  currency: string;
  description?: string;
  method: string;
  dueDate?: string;
  classId?: ID;
}

// Student-Class relationship
export interface StudentClassRelation {
  id: ID;
  studentId: ID;
  studentName?: string | null;
  trainingClassId: ID;
  className?: string | null;
  enrollmentDate: ISODateTime;
  isActive: boolean;
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
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  description?: string | null;
  website?: string | null;
  establishedDate?: ISODateTime | null;
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

export interface DojaangFormData {
  name: string;
  address: string;
  location: string;
  phoneNumber: string;
  email: string;
  koreanName: string;
  koreanNamePhonetic: string;
  coachId?: ID | null;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
  website?: string;
  establishedDate?: string;
  isActive?: boolean;
}

// ============================================================================
// BLOG POST DTOs
// ============================================================================

export interface BlogPostDto {
  id: ID;
  title: string;
  content: string;
  authorId: ID;
  authorName?: string | null;
  isActive: boolean;
}

export interface CreateBlogPostDto {
  title: string;
  content: string;
}

export interface UpdateBlogPostDto {
  title: string;
  content: string;
}

// ============================================================================
// EVENT DTOs
// ============================================================================

export interface EventDto {
  id: ID;
  name: string;
  description?: string | null;
  type: number; // EventType enum as number from backend
  startDate: ISODateTime;
  endDate: ISODateTime;
  location?: string | null;
  coachId: ID;
  dojaangId?: ID | null;
}

export interface CreateEventDto {
  name: string;
  description?: string | null;
  type: EventType;
  startDate: ISODateTime;
  endDate: ISODateTime;
  location?: string | null;
  coachId: ID;
  dojaangId?: ID | null;
}

export interface UpdateEventDto {
  id: ID;
  name?: string;
  description?: string | null;
  type?: EventType;
  startDate?: ISODateTime;
  endDate?: ISODateTime;
  location?: string | null;
  coachId?: ID;
  dojaangId?: ID | null;
}

export interface EventManagementDto {
  id: ID;
  title: string;
  description: string;
  eventDate: ISODateTime;
  location: string;
  eventType: string | number;
  maxParticipants?: number | null;
  currentParticipants: number;
  registrationDeadline?: ISODateTime | null;
  price?: number | null;
  isActive: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  eventDate: string;
  location: string;
  eventType: string | number;
  maxParticipants: string | number;
  registrationDeadline: string;
  price: string | number;
  isActive: boolean;
}

export interface EventDisplayDto {
  id: ID;
  title: string;
  description: string;
  eventDate: ISODateTime;
  location: string;
  eventType: EventType;
  maxParticipants?: number | null;
  currentParticipants: number;
  registrationDeadline?: ISODateTime | null;
  price?: number | null;
  isActive: boolean;
}

// ============================================================================
// PROMOTION DTOs
// ============================================================================

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

export interface UpdatePromotionDto {
  id: ID;
  studentId?: ID;
  rankId?: ID;
  promotionDate?: ISODate;
  coachId?: ID;
  notes?: string | null;
  dojaangId?: ID;
}

// ============================================================================
// TUL DTOs
// ============================================================================

export interface TulDto {
  id: ID;
  name: string;
  description: string;
  recommendedRankId: ID;
  videoUrl?: string | null;
  imageUrl?: string | null;
}

// ============================================================================
// RANK DTOs
// ============================================================================

export interface RankDto {
  id: ID;
  name: string;
  order: number;
  description: string;
  color: BeltColor;
  stripeColor?: BeltColor | null;
  danLevel?: number | null;
  createdDate: ISODateTime;
  updatedDate: ISODateTime;
  isActive: boolean;
}

// Alias for Rank - using RankDto as base
export type Rank = RankDto;

// Alias for DojaangEditDto - using DojaangDto as base
export type DojaangEditDto = DojaangDto;

// ============================================================================
// PROFILE DTOs
// ============================================================================

export interface ProfileDto {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: ISODateTime | null;
  dojaangId?: ID | null;
  currentRankId?: ID | null;
  currentRankName?: string | null;
  joinDate?: ISODateTime | null;
  roles: string[];
  isActive: boolean;
  bio?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  parentName?: string | null;
  parentEmail?: string | null;
  parentPhone?: string | null;
  medicalNotes?: string | null;
  profilePicture?: string | null;
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  } | null;
  // Compatibility properties
  profilePictureUrl?: string | null;
  dojaangName?: string | null;
  beltLevel?: string | null;
  membershipStatus?: string | null;
  membershipStartDate?: ISODateTime | null;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  dojaangId?: ID | null;
  bio?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  medicalNotes?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
}

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
