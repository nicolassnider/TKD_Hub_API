"use client";
import { createContext, useEffect, useState, useContext, useCallback } from "react";
import { TrainingClass } from "../types/TrainingClass";
import { apiRequest } from "../utils/api";
import { useApiConfig } from "./ApiConfigContext";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

// Define the context type
type ClassContextType = {
  classes: TrainingClass[];
  fetchClasses: () => Promise<void>;
  addClass: (c: Omit<TrainingClass, "id">) => Promise<void>;
  updateClass: (id: number, c: Omit<TrainingClass, "id">) => Promise<void>;
  deleteClass: (id: number) => Promise<void>;
};

// Create and export the context
export const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Custom hook for consuming the context
export const useClasses = () => {
  const ctx = useContext(ClassContext);
  if (!ctx) throw new Error("useClasses must be used within a ClassProvider");
  return ctx;
};

export const ClassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<TrainingClass[]>([]);
  const { baseUrl } = useApiConfig();

  const { getToken } = useAuth();

  // Wrap fetchClasses in useCallback for stable reference
  const fetchClasses = useCallback(async () => {
    try {
      const response: unknown = await apiRequest(`${baseUrl}/Classes`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
        },
      });
      let data: unknown = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (
        typeof response === "object" &&
        response !== null &&
        Array.isArray((response as { data?: unknown }).data)
      ) {
        data = (response as { data: unknown[] }).data;
      }
      if (Array.isArray(data)) {
        setClasses(data as TrainingClass[]);
      } else {
        setClasses([]);
        console.error("Fetched data is not an array:", data);
      }
    } catch (e) {
      setClasses([]);
      console.error("Failed to fetch classes:", e);
    }
  }, [baseUrl, getToken]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Implementing addClass function
  const addClass = async (classData: Omit<TrainingClass, "id">) => {
    try {
      await apiRequest(`${baseUrl}/Classes`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });
      await fetchClasses();
    } catch (e: unknown) {
      let apiMessage = "Failed to add class.";
      if (typeof e === "object" && e !== null) {
        // Try to extract the error message from known error shapes
        if ("message" in e && typeof (e as { message: unknown }).message === "string") {
          apiMessage = (e as { message: string }).message;
        } else if (
          "response" in e &&
          typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === "string"
        ) {
          apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
        }
      }
      if (apiMessage === "Coach is already assigned to another class at the same time.") {
        toast.error(apiMessage);
      } else {
        toast.error("Failed to add class.");
      }
      console.error("Failed to add class:", e);
    }
  };

  // Implementing updateClass function
  const updateClass = async (id: number, classData: Omit<TrainingClass, "id">) => {
    try {
      await apiRequest(`${baseUrl}/Classes/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${getToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(classData),
      });
      await fetchClasses(); // Refresh the classes after updating
    } catch (e) {
      console.error("Failed to update class:", e);
    }
  };

  // Implementing deleteClass function
  const deleteClass = async (id: number) => {
    try {
      await apiRequest(`${baseUrl}/Classes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken}`,
        },
      });
      await fetchClasses(); // Refresh the classes after deleting
    } catch (e) {
      console.error("Failed to delete class:", e);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);
  return (
    <ClassContext.Provider value={{ classes, fetchClasses, addClass, updateClass, deleteClass }}>
      {children}
    </ClassContext.Provider>
  );
};
