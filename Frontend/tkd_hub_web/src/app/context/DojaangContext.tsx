'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
    ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import { useApiRequest } from '../utils/api';
import { Dojaang } from '../types/Dojaang';

// --- Type Definitions ---
type DojaangContextType = {
    dojaangs: Dojaang[];
    loading: boolean;
    error: string | null;
    fetchDojaangs: () => Promise<Dojaang[]>;
    createDojaang: (data: Omit<Dojaang, 'id'>) => Promise<void>;
    updateDojaang: (id: number, data: Omit<Dojaang, 'id'>) => Promise<void>;
    deleteDojaang: (id: number) => Promise<void>;
    getDojaang: (id: number) => Promise<Dojaang | null>;
};

// --- Context Creation ---
const DojaangContext = createContext<DojaangContextType | undefined>(undefined);

// --- Dojaang Provider Component ---
export const DojaangProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();

    const dojaangByIdCache = useRef<Map<number, Dojaang>>(new Map());

    // --- Functions (memoized with useCallback) ---
    const fetchDojaangs = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setError("Authentication token not found. Please log in.");
            setLoading(false);
            return [];
        }

        setLoading(true);
        setError(null);
        try {
            const response = await apiRequest<{ data: Dojaang[] }>("/Dojaang", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fetchedDojaangs = Array.isArray(response.data) ? response.data : [];
            setDojaangs(fetchedDojaangs);

            // Populate cache
            fetchedDojaangs.forEach(dojaang => {
                if (dojaang.id != null) {
                    dojaangByIdCache.current.set(dojaang.id, dojaang);
                }
            });

            return fetchedDojaangs;
        } catch (e) {
            setError(e instanceof Error ? `Failed to load dojaangs: ${e.message}` : "Failed to load dojaangs");
            setDojaangs([]);
            console.error("Error fetching dojaangs:", e);
            return [];
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]);

    const createDojaang = useCallback(async (data: Omit<Dojaang, "id">) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token not found.");

            dojaangByIdCache.current.clear();

            await apiRequest("/Dojaang", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });
            await fetchDojaangs();
        } catch (e) {
            setError(e instanceof Error ? `Failed to create dojaang: ${e.message}` : "Failed to create dojaang");
            console.error("Error creating dojaang:", e);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken, fetchDojaangs]);

    const updateDojaang = useCallback(async (id: number, data: Omit<Dojaang, "id">) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token not found.");

            dojaangByIdCache.current.delete(id);

            await apiRequest(`/Dojaang/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...data, id }),
            });
            await fetchDojaangs();
        } catch (e) {
            setError(e instanceof Error ? `Failed to update dojaang: ${e.message}` : "Failed to update dojaang");
            console.error("Error updating dojaang:", e);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken, fetchDojaangs]);

    const deleteDojaang = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token not found.");

            dojaangByIdCache.current.delete(id);

            await apiRequest(`/Dojaang/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchDojaangs();
        } catch (e) {
            setError(e instanceof Error ? `Failed to delete dojaang: ${e.message}` : "Failed to delete dojaang");
            console.error("Error deleting dojaang:", e);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken, fetchDojaangs]);

    const getDojaang = useCallback(async (id: number): Promise<Dojaang | null> => {
        if (dojaangByIdCache.current.has(id)) {
            return dojaangByIdCache.current.get(id) || null;
        }

        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token not found.");

            const data = await apiRequest<Dojaang>(`/Dojaang/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (data && data.id != null) {
                dojaangByIdCache.current.set(data.id, data);
            }
            return data;
        } catch (e) {
            setError(e instanceof Error ? `Failed to fetch dojaang: ${e.message}` : "Failed to fetch dojaang");
            console.error("Error fetching dojaang:", e);
            return null;
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]);

    // --- Effects ---
    useEffect(() => {
        fetchDojaangs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Render ---
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

// --- Custom Hook to Consume Context ---
export const useDojaangs = () => {
    const ctx = useContext(DojaangContext);
    if (!ctx) throw new Error("useDojaangs must be used within a DojaangProvider");
    return ctx;
};
