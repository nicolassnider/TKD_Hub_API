// Common base types used across the application
export type ID = number;

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Date and time types
export type ISODate = string; // ISO date format (YYYY-MM-DD)
export type ISODateTime = string; // ISO datetime format
export type TimeString = string; // HH:mm format

// Common enums
export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum Gender {
  Unspecified = 0,
  Male = 1,
  Female = 2,
}

// Base entity interface
export interface BaseEntity {
  id: ID;
  createdAt?: ISODateTime;
  updatedAt?: ISODateTime;
}

// Audit fields
export interface AuditFields {
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

// Common response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

// Common form states
export interface FormState<T> {
  data: T;
  errors: Record<keyof T, string>;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Generic CRUD operations
export interface CrudOperations<T, CreateT = Omit<T, "id">, UpdateT = T> {
  getAll: () => Promise<T[]>;
  getById: (id: ID) => Promise<T>;
  create: (item: CreateT) => Promise<T>;
  update: (id: ID, item: UpdateT) => Promise<T>;
  delete: (id: ID) => Promise<void>;
}
