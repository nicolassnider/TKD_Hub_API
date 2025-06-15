"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { TrainingClass } from "../types/TrainingClass";
import { useApiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";
import { Student } from "../types/Student";

// Define the context type
type ClassContextType = {
  classes: TrainingClass[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  getClassById: (id: number) => Promise<TrainingClass | null>;
  addClass: (c: Omit<TrainingClass, "id">) => Promise<void>;
  updateClass: (id: number, c: Omit<TrainingClass, "id">) => Promise<void>;
  deleteClass: (id: number) => Promise<void>;
  addStudentToClass: (studentId: number, classId: number) => Promise<void>;
  getStudentsByClass: (classId: number) => Promise<Student[]>; // <-- Add this line
  getClassesByDay: (day?: number) => Promise<TrainingClass[]>;
};

// Create and export the context
const ClassContext = createContext<ClassContextType>({
  classes: [],
  loading: false,
  error: null,
  fetchClasses: async () => { },
  getClassById: async () => null,
  addClass: async () => { },
  updateClass: async () => { },
  deleteClass: async () => { },
  addStudentToClass: async () => { },
  getStudentsByClass: async () => [],
  getClassesByDay: async () => [],
});

// Custom hook for consuming the context
export const useClasses = () => useContext(ClassContext);

export const ClassProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<TrainingClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const { apiRequest } = useApiRequest();

  // --- GET /Classes ---
  // Wrap fetchClasses in useCallback for stable reference
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ data: TrainingClass[] }>("/Classes", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      setClasses(Array.isArray(response.data) ? response.data : []);
    } catch {
      setClasses([]);
      setError("Failed to fetch classes.");
      toast.error("Failed to fetch classes.");
    } finally {
      setLoading(false);
    }
  }, [apiRequest, getToken]);

  // --- GET /Classes/:id ---
  // Implementing getClassById function
  const getClassById = useCallback(
    async (id: number): Promise<TrainingClass | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest<TrainingClass>(`/Classes/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${getToken()}`,
          },
        });
        return data;
      } catch (e) {
        setError("Failed to fetch class by ID.");
        toast.error("Failed to fetch class by ID.");
        console.error("Failed to fetch class by ID:", e);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, getToken]
  );

  // --- POST /Classes ---
  // Implementing addClass function
  const addClass = async (classData: Omit<TrainingClass, "id">) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest("/Classes", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });
      toast.success("Class added successfully.");
      await fetchClasses();
    } catch (e: unknown) {
      let apiMessage = "Failed to add class.";
      if (typeof e === "object" && e !== null) {
        if ("message" in e && typeof (e as { message: unknown }).message === "string") {
          apiMessage = (e as { message: string }).message;
        } else if (
          "response" in e &&
          typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === "string"
        ) {
          apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
        }
      }
      setError(apiMessage);
      toast.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- PUT /Classes/:id ---
  // Implementing updateClass function
  const updateClass = async (id: number, classData: Omit<TrainingClass, "id">) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/Classes/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });
      toast.success("Class updated successfully.");
      await fetchClasses();
    } catch (e: unknown) {
      let apiMessage = "Failed to update class.";
      if (typeof e === "object" && e !== null) {
        if ("message" in e && typeof (e as { message: unknown }).message === "string") {
          apiMessage = (e as { message: string }).message;
        } else if (
          "response" in e &&
          typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === "string"
        ) {
          apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
        }
      }
      setError(apiMessage);
      toast.error(apiMessage);
      console.error("Failed to update class:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- POST /Students/:studentId/trainingclasses/:classId ---  
  const addStudentToClass = async (studentId: number, classId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/Students/${studentId}/trainingclasses/${classId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("Student added to class.");
      await fetchClasses();
    } catch (e: unknown) {
      let apiMessage = "Failed to add student to class.";
      if (typeof e === "object" && e !== null) {
        if ("message" in e && typeof (e as { message: unknown }).message === "string") {
          apiMessage = (e as { message: string }).message;
        } else if (
          "response" in e &&
          typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === "string"
        ) {
          apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
        }
      }
      setError(apiMessage);
      toast.error(apiMessage);
      console.error("Failed to add student to class:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE /Classes/:id ---
  // Implementing deleteClass function
  const deleteClass = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/Classes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      toast.success("Class deleted successfully.");
      await fetchClasses();
    } catch (e: unknown) {
      let apiMessage = "Failed to delete class.";
      if (typeof e === "object" && e !== null) {
        if ("message" in e && typeof (e as { message: unknown }).message === "string") {
          apiMessage = (e as { message: string }).message;
        } else if (
          "response" in e &&
          typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === "string"
        ) {
          apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
        }
      }
      setError(apiMessage);
      toast.error(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- GET /Classes/:classId/students ---
  const getStudentsByClass = useCallback(
    async (classId: number): Promise<Student[]> => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest<{ data: Student[] }>(
          `/Classes/${classId}/students`,
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        setLoading(false);
        return Array.isArray(res.data) ? res.data : [];
      } catch {
        setError("Failed to load students for class");
        setLoading(false);
        toast.error("Failed to load students for class");
        return [];
      }
    },
    [apiRequest, getToken]
  );

  // --- GET /Classes/by-day?day=... ---
  // day: 0 (Sunday) to 6 (Saturday), or undefined for today
  const getClassesByDay = useCallback(
    async (day?: number): Promise<TrainingClass[]> => {
      setLoading(true);
      setError(null);
      try {
        const url = day !== undefined ? `/Classes/by-day?day=${day}` : `/Classes/by-day`;
        const response = await apiRequest<{ data: TrainingClass[] }>(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${getToken()}`,
          },
        });
        return Array.isArray(response.data) ? response.data : [];
      } catch {
        setError("Failed to fetch classes by day.");
        toast.error("Failed to fetch classes by day.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, getToken]
  );

  return (
    <ClassContext.Provider
      value={{
        classes,
        loading,
        error,
        fetchClasses,
        getClassById,
        addClass,
        updateClass,
        deleteClass,
        addStudentToClass,
        getStudentsByClass, // <-- add here
        getClassesByDay, // <-- add here
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
