'use client';
import React, { createContext, useContext, useEffect, useState } from "react";
import { Tul } from "../types/Tul";
import { apiRequest } from "../utils/api"; // Make sure this path is correct
import toast from "react-hot-toast";
import { useApiConfig } from "./ApiConfigContext";

interface TulContextType {
    tuls: Tul[];
    loading: boolean;
    error: string | null;
}

const TulContext = createContext<TulContextType>({
    tuls: [],
    loading: false,
    error: null,
});

export const useTulContext = () => useContext(TulContext);

export const TulProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tuls, setTuls] = useState<Tul[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { baseUrl } = useApiConfig(); // Get baseUrl from context

    useEffect(() => {
        apiRequest<{ data: { data: Tul[] } }>(`${baseUrl}/tuls`)
            .then((res) => {
                setTuls(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load tuls");
                setLoading(false);
                toast.error("Failed to load tuls" + (err instanceof Error ? `: ${err.message}` : ""));
            });
    }, [baseUrl]);

    return (
        <TulContext.Provider value={{ tuls, loading, error }}>
            {children}
        </TulContext.Provider>
    );
};
