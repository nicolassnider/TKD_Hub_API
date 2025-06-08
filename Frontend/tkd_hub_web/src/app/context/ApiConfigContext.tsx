'use client'
import React, { createContext, useContext, useMemo } from "react";

type ApiConfig = {
    baseUrl: string;
};

const ApiConfigContext = createContext<ApiConfig | undefined>(undefined);

export const ApiConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const baseUrl =
        typeof window === "undefined"
            ? process.env.NEXT_PUBLIC_API_BASE_URL || ""
            : (window as unknown as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL
            || process.env.NEXT_PUBLIC_API_BASE_URL
            || "";

    const value = useMemo(() => ({ baseUrl }), [baseUrl]);

    return (
        <ApiConfigContext.Provider value={value}>
            {children}
        </ApiConfigContext.Provider>
    );
};

export const useApiConfig = () => {
    const context = useContext(ApiConfigContext);
    if (!context) {
        throw new Error("useApiConfig must be used within an ApiConfigProvider");
    }
    return context;
};
