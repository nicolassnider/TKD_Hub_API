"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { TrainingClass } from "../types/TrainingClass";
import { useApiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

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
});

// Custom hook for consuming the context
export const useClasses = () => useContext(ClassContext);

export const ClassProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<TrainingClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const { apiRequest } = useApiRequest();


  // Wrap fetchClasses in useCallback for stable reference
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<TrainingClass[]>("/Classes", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      setClasses(Array.isArray(data) ? data : []);
    } catch {
      setClasses([]);
      setError("Failed to fetch classes.");
      toast.error("Failed to fetch classes.");
    } finally {
      setLoading(false);
    }
  }, [apiRequest, getToken]);  

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
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};
