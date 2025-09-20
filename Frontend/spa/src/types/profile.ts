// Profile-related types for user dashboard and class management

import { TrainingClass } from "./classes";

// User Profile Information
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  profilePictureUrl?: string;
  membershipStartDate?: string;
  membershipStatus: "Active" | "Suspended" | "Inactive";
  dojaangId?: number;
  dojaangName?: string;
  beltLevel?: string;
  roles: string[];
}

// Coach-specific profile data
export interface CoachProfile extends UserProfile {
  specializations?: string[];
  yearsOfExperience?: number;
  certifications?: string[];
  bio?: string;
  managedClasses: TrainingClass[];
}

// Student-specific profile data
export interface StudentProfile extends UserProfile {
  enrolledClass?: TrainingClass;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  nextPaymentDue?: string;
  monthlyFee?: number;
  attendanceRate?: number;
  lastAttendance?: string;
  joinDate?: string;
}

// Combined profile for users with multiple roles
export interface CombinedProfile extends UserProfile {
  coachData?: {
    managedClasses: TrainingClass[];
    specializations?: string[];
    yearsOfExperience?: number;
  };
  studentData?: {
    enrolledClass?: TrainingClass;
    paymentStatus: "Paid" | "Pending" | "Overdue";
    nextPaymentDue?: string;
    monthlyFee?: number;
    attendanceRate?: number;
  };
}

// Payment-related types
export interface PaymentInfo {
  id: number;
  studentId: number;
  amount: number;
  currency: string;
  paymentDate: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Cancelled";
  paymentMethod: "MercadoPago" | "Cash" | "Transfer" | "Other";
  transactionId?: string;
  description: string;
  classId?: number;
  className?: string;
}

export interface MercadopagoPayment {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  preferenceId?: string;
  paymentUrl?: string;
  status:
    | "pending"
    | "approved"
    | "authorized"
    | "in_process"
    | "in_mediation"
    | "rejected"
    | "cancelled"
    | "refunded"
    | "charged_back";
  studentId: number;
  classId?: number;
  dueDate: string;
}

// Class enrollment data
export interface ClassEnrollment {
  id: number;
  studentId: number;
  classId: number;
  enrollmentDate: string;
  status: "Active" | "Inactive" | "Suspended";
  lastAttendance?: string;
  attendanceCount: number;
  totalSessions: number;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  class: TrainingClass;
}

// Attendance tracking
export interface AttendanceRecord {
  id: number;
  studentId: number;
  classId: number;
  date: string;
  present: boolean;
  notes?: string;
  className: string;
  studentName: string;
}

// Dashboard statistics
export interface ProfileStats {
  totalClasses: number;
  attendanceRate: number;
  nextPaymentDue?: string;
  totalStudents?: number; // For coaches
  upcomingClasses: TrainingClass[];
  recentPayments: PaymentInfo[];
  attendanceHistory: AttendanceRecord[];
}

// Profile update data
export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  profilePictureUrl?: string;
  bio?: string; // For coaches
  specializations?: string[]; // For coaches
}

// API response types
export interface ProfileApiResponse {
  success: boolean;
  data: UserProfile | CoachProfile | StudentProfile | CombinedProfile;
  message?: string;
}

export interface PaymentApiResponse {
  success: boolean;
  data: PaymentInfo[] | MercadopagoPayment;
  message?: string;
}

export interface EnrollmentApiResponse {
  success: boolean;
  data: ClassEnrollment[];
  message?: string;
}

// Form data types
export interface PaymentFormData {
  amount: number;
  description: string;
  classId?: number;
  dueDate: string;
  currency: string;
}

export interface ProfileFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  coachInfo?: {
    bio?: string;
    specializations?: string[];
    yearsOfExperience?: number;
  };
}

// Profile permissions
export interface ProfilePermissions {
  canEditProfile: boolean;
  canViewPayments: boolean;
  canMakePayments: boolean;
  canViewClasses: boolean;
  canManageClasses: boolean;
  canViewStudents: boolean;
  canMarkAttendance: boolean;
}

// Utility types
export type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Cancelled";
export type MembershipStatus = "Active" | "Suspended" | "Inactive";
export type EnrollmentStatus = "Active" | "Inactive" | "Suspended";

// Constants
export const PAYMENT_METHODS = {
  MERCADOPAGO: "MercadoPago",
  CASH: "Cash",
  TRANSFER: "Transfer",
  OTHER: "Other",
} as const;

export const PAYMENT_STATUSES = {
  PAID: "Paid",
  PENDING: "Pending",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
} as const;

export const MEMBERSHIP_STATUSES = {
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  INACTIVE: "Inactive",
} as const;
