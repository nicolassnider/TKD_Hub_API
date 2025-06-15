"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useApiRequest } from "../utils/api";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { Coach } from "@/app/types/Coach";
import { CoachApiResponse } from "../components/coaches/EditCoach";
import { UpsertCoachDto } from "../types/UpsertCoachDto";


type CoachContextType = {
    coaches: Coach[];
    loading: boolean;
    error: string | null;
    fetchCoaches: () => Promise<void>;
    getCoachById: (id: number) => Promise<CoachApiResponse | null>;
    createCoach: (data: Omit<Coach, "id" | "joinDate"> & { password: string; roleIds: number[] }) => Promise<void>;
    updateCoach: (id: number, data: Partial<Coach>) => Promise<void>;
    deleteCoach: (id: number) => Promise<void>;
    upsertCoach: (data: UpsertCoachDto) => Promise<void>; // <-- Use DTO here
    removeCoachFromDojaang: (coachId: number, dojaangId: number) => Promise<void>;
    updateManagedDojaangs: (coachId: number, dojaangIds: number[]) => Promise<void>;
    getCoachesByDojaang: (dojaangId: number) => Promise<Coach[]>;
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
    getCoachesByDojaang: async () => [],
});

export const useCoaches = () => useContext(CoachContext);

export const CoachProvider = ({ children }: { children: ReactNode }) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();

    // --- GET /Coaches ---
    const fetchCoaches = useCallback(async () => {
        if (coaches.length > 0) return; // Prevent refetch if already loaded
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest<{ data: Coach[] }>("/Coaches", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                },
            });
            setCoaches(Array.isArray(response.data) ? response.data : []);
        } catch {
            setCoaches([]);
            setError("Failed to fetch coaches.");
            toast.error("Failed to fetch coaches.");
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken, coaches.length]);

    // --- GET /Coaches/:id ---
    const getCoachById = async (id: number): Promise<CoachApiResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest(`/Coaches/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setLoading(false);
            return res as CoachApiResponse;
        } catch {
            setError("Failed to load coach");
            setLoading(false);
            toast.error("Failed to load coach");
            return null;
        }
    };

    // --- POST /Coaches ---
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

    // --- PUT /Coaches/:id ---
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
            await fetchCoaches();
        } catch {
            setError("Failed to update coach");
            toast.error("Failed to update coach");
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE /Coaches/:id ---
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

    // --- POST /Coaches/upsert ---
    const upsertCoach = async (data: UpsertCoachDto) => {
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
            await fetchCoaches();
        } catch {
            setError("Failed to upsert coach");
            toast.error("Failed to upsert coach");
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE /Coaches/:coachId/dojaangs/:dojaangId ---
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

    // --- PUT /Coaches/:coachId/managed-dojaangs ---
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

    // --- GET /Coaches/by-dojaang/:dojaangId ---
    const getCoachesByDojaang = useCallback(async (dojaangId: number): Promise<Coach[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest<{ data: Coach[] }>(`/Coaches/by-dojaang/${dojaangId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${getToken()}`,
                },
            });
            return Array.isArray(response.data) ? response.data : [];
        } catch {
            setError("Failed to fetch coaches by dojaang.");
            toast.error("Failed to fetch coaches by dojaang.");
            return [];
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]);

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
                getCoachesByDojaang,
            }}
        >
            {children}
        </CoachContext.Provider>
    );
};
