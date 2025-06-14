"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useApiRequest } from "../utils/api";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { Coach } from "@/app/types/Coach";

type CoachContextType = {
    coaches: Coach[];
    loading: boolean;
    error: string | null;
    fetchCoaches: () => Promise<void>;
    getCoachById: (id: number) => Promise<Coach | null>;
    createCoach: (data: Omit<Coach, "id" | "joinDate"> & { password: string; roleIds: number[] }) => Promise<void>;
    updateCoach: (id: number, data: Partial<Coach>) => Promise<void>;
    deleteCoach: (id: number) => Promise<void>;
    upsertCoach: (data: Partial<Coach>) => Promise<void>;
    removeCoachFromDojaang: (coachId: number, dojaangId: number) => Promise<void>;
    updateManagedDojaangs: (coachId: number, dojaangIds: number[]) => Promise<void>;
};

const CoachContext = createContext<CoachContextType>({
    coaches: [],
    loading: false,
    error: null,
    fetchCoaches: async () => { },
    getCoachById: async () => null,
    createCoach: async () => { },
    updateCoach: async () => { },
    deleteCoach: async () => { },
    upsertCoach: async () => { },
    removeCoachFromDojaang: async () => { },
    updateManagedDojaangs: async () => { },
});

export const useCoaches = () => useContext(CoachContext);

export const CoachProvider = ({ children }: { children: ReactNode }) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();

    const fetchCoaches = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<Coach[]>("/Coaches", {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setCoaches(res);
        } catch {
            setError("Failed to load coaches");
            setCoaches([]);
            toast.error("Failed to load coaches");
        } finally {
            setLoading(false);
        }
    };    

    const getCoachById = async (id: number): Promise<Coach | null> => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<Coach>(`/Coaches/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setLoading(false);
            return res;
        } catch {
            setError("Failed to load coach");
            setLoading(false);
            toast.error("Failed to load coach");
            return null;
        }
    };

    const createCoach = async (data: Omit<Coach, "id" | "joinDate"> & { password: string; roleIds: number[] }) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest("/Coaches", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            toast.success("Coach created");
            await fetchCoaches();
        } catch {
            setError("Failed to create coach");
            toast.error("Failed to create coach");
        } finally {
            setLoading(false);
        }
    };

    const updateCoach = async (id: number, data: Partial<Coach>) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest(`/Coaches/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            toast.success("Coach updated");
            await fetchCoaches();
        } catch {
            setError("Failed to update coach");
            toast.error("Failed to update coach");
        } finally {
            setLoading(false);
        }
    };

    const deleteCoach = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest(`/Coaches/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            toast.success("Coach deleted");
            await fetchCoaches();
        } catch {
            setError("Failed to delete coach");
            toast.error("Failed to delete coach");
        } finally {
            setLoading(false);
        }
    };

    const upsertCoach = async (data: Partial<Coach>) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest(`/Coaches/upsert`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            toast.success("Coach upserted");
            await fetchCoaches();
        } catch {
            setError("Failed to upsert coach");
            toast.error("Failed to upsert coach");
        } finally {
            setLoading(false);
        }
    };

    const removeCoachFromDojaang = async (coachId: number, dojaangId: number) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest(`/Coaches/${coachId}/dojaangs/${dojaangId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            toast.success("Coach removed from dojaang");
            await fetchCoaches();
        } catch {
            setError("Failed to remove coach from dojaang");
            toast.error("Failed to remove coach from dojaang");
        } finally {
            setLoading(false);
        }
    };

    const updateManagedDojaangs = async (coachId: number, dojaangIds: number[]) => {
        setLoading(true);
        setError(null);
        try {
            await apiRequest(`/Coaches/${coachId}/managed-dojaangs`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dojaangIds),
            });
            toast.success("Managed dojaangs updated");
            await fetchCoaches();
        } catch {
            setError("Failed to update managed dojaangs");
            toast.error("Failed to update managed dojaangs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CoachContext.Provider
            value={{
                coaches,
                loading,
                error,
                fetchCoaches,
                getCoachById,
                createCoach,
                updateCoach,
                deleteCoach,
                upsertCoach,
                removeCoachFromDojaang,
                updateManagedDojaangs,
            }}
        >
            {children}
        </CoachContext.Provider>
    );
};
