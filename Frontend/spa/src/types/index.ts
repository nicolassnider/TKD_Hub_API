/**
 * TKD Hub Types - Central Export Point
 *
 * All types have been consolidated into api.ts to match backend DTOs exactly.
 * This provides type safety and consistency with the .NET backend.
 */

// ============================================================================
// PRIMARY EXPORTS - Use these for new code
// ============================================================================

// Export all consolidated API types (aligned with backend DTOs)
export * from "./api";

// ============================================================================
// MIGRATION GUIDE
// ============================================================================

/**
 * All types have been consolidated in api.ts to match the backend DTOs exactly.
 *
 * Migration from legacy types to consolidated API types:
 *
 * OLD:  import { User, CreateUserRequest } from './types'
 * NEW:  import { UserDto, CreateUserDto } from './types'
 *
 * OLD:  import { TrainingClass } from './types'
 * NEW:  import { TrainingClassDto } from './types'
 *
 * OLD:  import { ClassSchedule } from './types'
 * NEW:  import { ClassScheduleDto } from './types'
 *
 * OLD:  import { Dojaang } from './types'
 * NEW:  import { DojaangDto } from './types'
 *
 * The new types in api.ts exactly match the backend DTOs for consistency.
 *
 * Available consolidated types:
 * - UserDto, CreateUserDto, CreateStudentDto, UpdateStudentDto
 * - TrainingClassDto, CreateTrainingClassDto, ClassScheduleDto
 * - DojaangDto, ManagedDojaangDto, UpdateDojaangDto
 * - AttendanceHistoryDto, StudentClassDto
 * - All enums: Gender, BeltColor, AttendanceStatus, DayOfWeek, etc.
 */
