'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useApiRequest } from "../utils/api";
import { Dojaang } from "../types/Dojaang";

type DojaangContextType = {
    dojaangs: Dojaang[];
    loading: boolean;
    error: string | null;
    fetchDojaangs: () => void;
    createDojaang: (data: Omit<Dojaang, "id">) => Promise<void>;
    updateDojaang: (id: number, data: Omit<Dojaang, "id">) => Promise<void>;
    deleteDojaang: (id: number) => Promise<void>;
    getDojaang: (id: number) => Promise<Dojaang | null>;
};

const DojaangContext = createContext<DojaangContextType | undefined>(undefined);

export const DojaangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();

    const fetchDojaangs = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setError("No auth token");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Expecting { data: Dojaang[] } from API
            const response = await apiRequest<{ data: Dojaang[] }>("/Dojaang", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDojaangs(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to load dojaangs");
            setDojaangs([]);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]);

    useEffect(() => {
        const token = getToken();
        if (token) {
            fetchDojaangs();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createDojaang = async (data: Omit<Dojaang, "id">) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            await apiRequest("/Dojaang", {
                method: "POST",
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });
            await fetchDojaangs();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to create dojaang");
        } finally {
            setLoading(false);
        }
    };

    const updateDojaang = async (id: number, data: Omit<Dojaang, "id">) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            await apiRequest(`/Dojaang/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...data, id }),
            });
            await fetchDojaangs();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to update dojaang");
        } finally {
            setLoading(false);
        }
    };

    const deleteDojaang = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            await apiRequest(`/Dojaang/${id}`, {
                method: "DELETE",
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            await fetchDojaangs();
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to delete dojaang");
        } finally {
            setLoading(false);
        }
    };

    const getDojaang = async (id: number): Promise<Dojaang | null> => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            const data = await apiRequest<Dojaang>(`/Dojaang/${id}`, {
                headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            return data;
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to fetch dojaang");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <DojaangContext.Provider value={{
            dojaangs,
            loading,
            error,
            fetchDojaangs,
            createDojaang,
            updateDojaang,
            deleteDojaang,
            getDojaang,
        }}>
            {children}
        </DojaangContext.Provider>
    );
};

export const useDojaangs = () => {
    const ctx = useContext(DojaangContext);
    if (!ctx) throw new Error("useDojaangs must be used within a DojaangProvider");
    return ctx;
};
