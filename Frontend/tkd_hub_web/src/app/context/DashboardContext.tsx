'use client';

// 1. External imports
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useApiRequest } from "@/app/utils/api";

// 2. Types
type DashboardRequest = {
    userRole: string;
    widgets: string[];
};

type DashboardResponse = {
    data: Record<string, unknown>;
};

type DashboardContextType = {
    loading: boolean;
    error: string | null;
    createDashboard: (req: DashboardRequest) => Promise<DashboardResponse | null>;
};

// 3. Create and export the context
const DashboardContext = createContext<DashboardContextType>({
    loading: false,
    error: null,
    createDashboard: async () => null,
});

// 4. Custom hook for consuming the context
export const useDashboards = () => useContext(DashboardContext);

// 5. Provider
export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 1. State hooks
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 2. Context hooks
    const { apiRequest } = useApiRequest();

    // 3. Functions
    const createDashboard = async (req: DashboardRequest): Promise<DashboardResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<DashboardResponse>(
                "/Dashboards",
                {
                    method: "POST",
                    body: JSON.stringify(req),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
                // If your apiRequest supports passing a token function, add it here as the third argument
            );
            return data;
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === "string") {
                setError(err);
            } else {
                setError("Unknown error");
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 4. Render
    return (
        <DashboardContext.Provider value={{ createDashboard, loading, error }}>
            {children}
        </DashboardContext.Provider>
    );
};
