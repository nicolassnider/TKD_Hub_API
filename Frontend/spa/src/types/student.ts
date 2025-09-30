import {
  ID,
  BaseEntity,
  ISODate,
  ISODateTime,
  Gender,
  Nullable,
  Optional,
} from "./common";

// Student core interface
export interface Student extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string; // Keep as string for form compatibility
  gender?: Gender;
  emergencyContact?: string;
  emergencyPhone?: string;
  currentRankId: number;
  currentRankName: string;
  dojaangId: number;
  dojaangName: string;
  isActive: boolean;
  joinDate: string; // Keep as string for form compatibility

  // Parent/Guardian information
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;

  // Additional information
  medicalNotes?: string;
  fullName?: string;
}

// Student creation DTO
export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: ISODate;
  gender?: Gender;
  emergencyContact?: string;
  emergencyPhone?: string;
  currentRankId?: ID;
  dojaangId?: ID;
  isActive?: boolean;
  joinDate?: ISODate;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  medicalNotes?: string;
}

// Student update DTO
export interface UpdateStudentDto extends CreateStudentDto {
  id: ID;
}

// Student for class assignment (simplified)
export interface StudentForAssignment {
  id: ID;
  firstName: string;
  lastName: string;
  email?: string;
  dojaangId?: ID;
  dojaangName?: string;
  currentRankName?: string;
  fullName?: string;
}

// Student form data (for forms)
export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  emergencyContact: string;
  emergencyPhone: string;
  currentRankId: number | "";
  dojaangId: number | "";
  isActive: boolean;
  joinDate: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  medicalNotes: string;
}

// Student filters
export interface StudentFilters {
  search?: string;
  dojaangId?: ID;
  rankId?: ID;
  isActive?: boolean;
  hasClasses?: boolean;
}
