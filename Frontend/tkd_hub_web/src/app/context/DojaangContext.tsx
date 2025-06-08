'use client'
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useApiConfig } from "./ApiConfigContext";
import { apiRequest } from "../utils/api";
import { Dojaang } from "../types/Dojaang"; // <-- Import the type

type DojaangContextType = {
    dojaangs: Dojaang[];
    loading: boolean;
    error: string | null;
    refreshDojaangs: () => void; // Renamed from 'refresh'
};

const DojaangContext = createContext<DojaangContextType | undefined>(undefined);

export const DojaangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useAuth();
    const { baseUrl } = useApiConfig();

    const fetchDojaangs = () => {
        setLoading(true);
        setError(null);
        const token = getToken();
        apiRequest(`${baseUrl}/Dojaang`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
        })
            .then(data => {
                let arr: Dojaang[] = [];
                // Assume the API returns { data: Dojaang[] }
                if (
                    data &&
                    typeof data === "object" &&
                    Array.isArray((data as { data?: unknown }).data)
                ) {
                    arr = (data as { data: Dojaang[] }).data.map((d) => ({
                        id: d.id,
                        name: d.name,
                        address: d.address,
                        phoneNumber: d.phoneNumber,
                        email: d.email,
                        koreanName: d.koreanName,
                        koreanNamePhonetic: d.koreanNamePhonetic,
                        coachId: d.coachId,
                        coachName: d.coachName,
                    }));
                }
                setDojaangs(arr);
                if (arr.length > 0) {
                    console.log(`[DojaangContext] Loaded ${arr.length} dojaangs into context.`);
                }
            })
            .catch(() => setError("Failed to load dojaangs"))
            .finally(() => setLoading(false));
    };
    useEffect(fetchDojaangs, [getToken, baseUrl]);

    return (
        <DojaangContext.Provider value={{ dojaangs, loading, error, refreshDojaangs: fetchDojaangs }}>
            {children}
        </DojaangContext.Provider>
    );
};

export const useDojaangs = () => {
    const ctx = useContext(DojaangContext);
    if (!ctx) throw new Error("useDojaangs must be used within a DojaangProvider");
    return ctx;
};
