'use client';
import React, { createContext, useContext, useState, useCallback } from "react";
import { Tul } from "../types/Tul";
import toast from "react-hot-toast";
import { useApiRequest } from "../utils/api";

interface TulContextType {
    tuls: Tul[];
    loading: boolean;
    error: string | null;
    fetchTuls: () => Promise<void>;
    getTulById: (id: number) => Promise<Tul | null>;
    getTulsByRank: (rankId: number) => Promise<Tul[]>;
}

const TulContext = createContext<TulContextType>({
    tuls: [],
    loading: false,
    error: null,
    fetchTuls: async () => { },
    getTulById: async () => null,
    getTulsByRank: async () => [],
});

export const useTulContext = () => useContext(TulContext);

export const TulProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tuls, setTuls] = useState<Tul[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { apiRequest } = useApiRequest();

    const fetchTuls = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<Tul[]>("/Tuls");
            setTuls(Array.isArray(res) ? res : []);
        } catch (err) {
            setError("Failed to load tuls");
            setTuls([]);
            toast.error("Failed to load tuls" + (err instanceof Error ? `: ${err.message}` : ""));
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    const getTulById = useCallback(async (id: number): Promise<Tul | null> => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<Tul>(`/Tuls/${id}`);
            return res;
        } catch (err) {
            setError("Failed to load tul");
            toast.error("Failed to load tul" + (err instanceof Error ? `: ${err.message}` : ""));
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    const getTulsByRank = useCallback(async (rankId: number): Promise<Tul[]> => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<Tul[]>(`/Tuls/by-rank/${rankId}`);
            return Array.isArray(res) ? res : [];
        } catch (err) {
            setError("Failed to load tuls by rank");
            toast.error("Failed to load tuls by rank" + (err instanceof Error ? `: ${err.message}` : ""));
            return [];
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);    

    return (
        <TulContext.Provider value={{ tuls, loading, error, fetchTuls, getTulById, getTulsByRank }}>
            {children}
        </TulContext.Provider>
    );
};
