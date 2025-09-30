import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useRole } from "./RoleContext";
import {
  TrainingClass,
  CreateTrainingClassDto,
  UpdateTrainingClassDto,
  StudentForAssignment,
  StudentClass,
  StudentClassAssignment,
  ClassPermissions,
  ScheduleConflict,
} from "../types/api";
import { fetchJson, ApiError } from "../lib/api";

interface ClassContextType {
  // State
  classes: TrainingClass[];
  currentClass: TrainingClass | null;
  enrolledStudents: StudentForAssignment[];
  availableStudents: StudentForAssignment[];
  loading: boolean;
  error: string | null;

  // Class CRUD operations
  fetchClasses: () => Promise<void>;
  fetchClass: (id: number) => Promise<TrainingClass | null>;
  createClass: (data: CreateTrainingClassDto) => Promise<TrainingClass>;
  updateClass: (
    id: number,
    data: UpdateTrainingClassDto,
  ) => Promise<TrainingClass>;
  deleteClass: (id: number) => Promise<void>;

  // Student assignment operations
  fetchStudentsForClass: (classId: number) => Promise<void>;
  fetchAvailableStudents: (classId?: number) => Promise<void>;
  assignStudentToClass: (studentId: number, classId: number) => Promise<void>;
  removeStudentFromClass: (studentId: number, classId: number) => Promise<void>;

  // Schedule validation
  validateSchedule: (
    schedules: any[],
    coachId: number,
    excludeClassId?: number,
  ) => Promise<ScheduleConflict[]>;

  // Permissions
  getPermissions: (trainingClass?: TrainingClass) => ClassPermissions;

  // Utilities
  clearError: () => void;
  formatScheduleDisplay: (schedules: any[]) => string;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

export const useClassContext = () => {
  const context = useContext(ClassContext);
  if (!context) {
    throw new Error("useClassContext must be used within a ClassProvider");
  }
  return context;
};

interface ClassProviderProps {
  children: ReactNode;
}

export const ClassProvider: React.FC<ClassProviderProps> = ({ children }) => {
  const [classes, setClasses] = useState<TrainingClass[]>([]);
  const [currentClass, setCurrentClass] = useState<TrainingClass | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<
    StudentForAssignment[]
  >([]);
  const [availableStudents, setAvailableStudents] = useState<
    StudentForAssignment[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { hasRole, token } = useRole();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const handleApiError = (error: any) => {
    if (error instanceof ApiError) {
      setError(`Error ${error.status}: ${error.message}`);
    } else {
      setError(error.message || "An unexpected error occurred");
    }
    console.error("Class API error:", error);
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Class CRUD operations
  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = (await fetchJson("/api/Classes", {
        headers: getAuthHeaders(),
      })) as { data: TrainingClass[] };

      setClasses(response.data || []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchClass = useCallback(
    async (id: number): Promise<TrainingClass | null> => {
      try {
        setLoading(true);
        setError(null);

        const response = (await fetchJson(`/api/Classes/${id}`, {
          headers: getAuthHeaders(),
        })) as { data: TrainingClass };

        const classData = response.data;
        setCurrentClass(classData);
        return classData;
      } catch (error) {
        handleApiError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const createClass = useCallback(
    async (data: CreateTrainingClassDto): Promise<TrainingClass> => {
      try {
        setLoading(true);
        setError(null);

        const response = (await fetchJson("/api/Classes", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        })) as { data: TrainingClass };

        const classData = response.data;
        setClasses((prev) => [...prev, classData]);
        return classData;
      } catch (error) {
        handleApiError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateClass = useCallback(
    async (
      id: number,
      data: UpdateTrainingClassDto,
    ): Promise<TrainingClass> => {
      try {
        setLoading(true);
        setError(null);

        const response = (await fetchJson(`/api/Classes/${id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        })) as { data: TrainingClass };

        const classData = response.data;
        setClasses((prev) => prev.map((c) => (c.id === id ? classData : c)));
        if (currentClass?.id === id) {
          setCurrentClass(classData);
        }
        return classData;
      } catch (error) {
        handleApiError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, currentClass],
  );

  const deleteClass = useCallback(
    async (id: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await fetchJson(`/api/Classes/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        setClasses((prev) => prev.filter((c) => c.id !== id));
        if (currentClass?.id === id) {
          setCurrentClass(null);
        }
      } catch (error) {
        handleApiError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, currentClass],
  );

  // Student assignment operations
  const fetchStudentsForClass = useCallback(
    async (classId: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = (await fetchJson(`/api/classes/${classId}/students`, {
          headers: getAuthHeaders(),
        })) as { data: StudentForAssignment[] };

        setEnrolledStudents(response.data || []);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const fetchAvailableStudents = useCallback(
    async (classId?: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const url = classId
          ? `/api/Students?excludeClassId=${classId}`
          : "/api/Students";

        const response = (await fetchJson(url, {
          headers: getAuthHeaders(),
        })) as StudentForAssignment[];

        setAvailableStudents(response);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const assignStudentToClass = useCallback(
    async (studentId: number, classId: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await fetchJson(
          `/api/Students/${studentId}/trainingclasses/${classId}`,
          {
            method: "POST",
            headers: getAuthHeaders(),
          },
        );

        // Refresh both lists
        await Promise.all([
          fetchStudentsForClass(classId),
          fetchAvailableStudents(classId),
        ]);
      } catch (error) {
        handleApiError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchStudentsForClass, fetchAvailableStudents],
  );

  const removeStudentFromClass = useCallback(
    async (studentId: number, classId: number): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        await fetchJson(
          `/api/Students/${studentId}/trainingclasses/${classId}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          },
        );

        // Refresh both lists
        await Promise.all([
          fetchStudentsForClass(classId),
          fetchAvailableStudents(classId),
        ]);
      } catch (error) {
        handleApiError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchStudentsForClass, fetchAvailableStudents],
  );

  // Schedule validation
  const validateSchedule = useCallback(
    async (
      schedules: any[],
      coachId: number,
      excludeClassId?: number,
    ): Promise<ScheduleConflict[]> => {
      try {
        const response = (await fetchJson("/api/Classes/validate-schedule", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            schedules,
            coachId,
            excludeClassId,
          }),
        })) as { conflicts?: ScheduleConflict[] };

        return response.conflicts || [];
      } catch (error) {
        console.error("Schedule validation error:", error);
        return [];
      }
    },
    [token],
  );

  // Permissions
  const getPermissions = useCallback(
    (trainingClass?: TrainingClass): ClassPermissions => {
      const isAdmin = hasRole("Admin");
      const isCoach = hasRole("Coach");

      // Admins can do everything
      if (isAdmin) {
        return {
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canManageStudents: true,
          canViewAttendance: true,
          canTakeAttendance: true,
        };
      }

      // Coaches can create classes and manage their own classes
      if (isCoach) {
        const isOwnClass = trainingClass
          ? trainingClass.coachId === getCurrentUserId()
          : false;

        return {
          canCreate: true,
          canEdit: isOwnClass,
          canDelete: isOwnClass,
          canManageStudents: isOwnClass,
          canViewAttendance: isOwnClass,
          canTakeAttendance: isOwnClass,
        };
      }

      // Students and guests can only view
      return {
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canManageStudents: false,
        canViewAttendance: false,
        canTakeAttendance: false,
      };
    },
    [hasRole],
  );

  // Helper to get current user ID (would need to be implemented based on your auth)
  const getCurrentUserId = (): number => {
    // This should return the current user's ID from your auth context
    // For now, returning 0 as placeholder
    return 0;
  };

  // Utility functions
  const formatScheduleDisplay = useCallback((schedules: any[]): string => {
    if (!schedules || schedules.length === 0) return "No schedules";

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return schedules
      .map((schedule) => {
        const day = dayNames[schedule.day] || "Unknown";
        return `${day} ${schedule.startTime}-${schedule.endTime}`;
      })
      .join(", ");
  }, []);

  const contextValue: ClassContextType = {
    // State
    classes,
    currentClass,
    enrolledStudents,
    availableStudents,
    loading,
    error,

    // Class CRUD operations
    fetchClasses,
    fetchClass,
    createClass,
    updateClass,
    deleteClass,

    // Student assignment operations
    fetchStudentsForClass,
    fetchAvailableStudents,
    assignStudentToClass,
    removeStudentFromClass,

    // Schedule validation
    validateSchedule,

    // Permissions
    getPermissions,

    // Utilities
    clearError,
    formatScheduleDisplay,
  };

  return (
    <ClassContext.Provider value={contextValue}>
      {children}
    </ClassContext.Provider>
  );
};
