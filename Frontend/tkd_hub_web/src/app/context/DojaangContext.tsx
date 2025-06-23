'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef, // Import useRef for creating mutable references for caches
    ReactNode,
} from 'react';
import { useAuth } from './AuthContext'; // Assuming AuthContext provides getToken
import { useApiRequest } from '../utils/api'; // Custom hook for API requests
import { Dojaang } from '../types/Dojaang'; // Assuming Dojaang type is defined here

// --- Type Definitions ---

/**
 * Defines the shape of the DojaangContext, outlining available data and functions.
 */
type DojaangContextType = {
    dojaangs: Dojaang[];
    loading: boolean;
    error: string | null;
    fetchDojaangs: () => void;
    createDojaang: (data: Omit<Dojaang, 'id'>) => Promise<void>;
    updateDojaang: (id: number, data: Omit<Dojaang, 'id'>) => Promise<void>;
    deleteDojaang: (id: number) => Promise<void>;
    getDojaang: (id: number) => Promise<Dojaang | null>;
};

// --- Context Creation ---

/**
 * Initializes the DojaangContext.
 * It's initialized as `undefined` to allow the `useDojaangs` hook to check if it's used
 * outside of the `DojaangProvider`, preventing common errors.
 */
const DojaangContext = createContext<DojaangContextType | undefined>(undefined);

// --- Dojaang Provider Component ---

/**
 * The `DojaangProvider` component is responsible for managing the state of dojaangs
 * (fetching, creating, updating, deleting) and providing dojaang-related functionalities to its children.
 * It uses memoization techniques to optimize performance by caching API responses.
 * @param children React nodes to be rendered within the provider's scope.
 */
export const DojaangProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State to hold the list of all dojaangs.
    const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
    // State to indicate if an API request is currently in progress.
    const [loading, setLoading] = useState(true);
    // State to store any error messages from API requests.
    const [error, setError] = useState<string | null>(null);

    // Context hooks for authentication token and API request utility.
    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();

    // --- Caches for Memoization ---
    // `dojaangByIdCache`: Stores individual Dojaang objects fetched by their ID.
    // Using `useRef` ensures the cache persists across renders without causing re-renders.
    const dojaangByIdCache = useRef<Map<number, Dojaang>>(new Map());

    // --- Functions (memoized with useCallback) ---

    /**
     * Fetches all dojaangs from the API.
     * Updates the `dojaangs` state and populates the `dojaangByIdCache` with fetched dojaangs
     * to optimize subsequent `getDojaang` calls.
     * This function is memoized using `useCallback` to prevent unnecessary re-creations.
     */
    const fetchDojaangs = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setError("Authentication token not found. Please log in.");
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
            const fetchedDojaangs = Array.isArray(response.data) ? response.data : [];
            setDojaangs(fetchedDojaangs);

            // Populate dojaangByIdCache for quick lookup of individual dojaangs.
            // Ensure `id` is a number before setting it in the Map.
            fetchedDojaangs.forEach(dojaang => {
                if (dojaang.id != null) { // Check if id is neither null nor undefined
                    dojaangByIdCache.current.set(dojaang.id, dojaang);
                }
            });
        } catch (e) {
            setError(e instanceof Error ? `Failed to load dojaangs: ${e.message}` : "Failed to load dojaangs");
            setDojaangs([]);
            console.error("Error fetching dojaangs:", e);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]); // Dependencies: `apiRequest` and `getToken` to ensure stability.

    /**
     * Creates a new dojaang in the database.
     * After successful creation, it invalidates the dojaang cache and triggers a refetch of all dojaangs
     * to update the local state and ensure data consistency.
     * This function is memoized using `useCallback`.
     * @param data The data (excluding id) for the new dojaang to be created.
     */
    const createDojaang = useCallback(async (data: Omit<Dojaang, "id">) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token not found.");

            // Invalidate the cache as new data is being added.
            dojaangByIdCache.current.clear();

            await apiRequest("/Dojaang", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });
            await fetchDojaangs(); // Re-fetch all dojaangs to update state and caches.
        } catch (e) {
            setError(e instanceof Error ? `Failed to create dojaang: ${e.message}` : "Failed to create dojaang");
            console.error("Error creating dojaang:", e);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken, fetchDojaangs]); // Dependencies: `apiRequest`, `getToken`, and `fetchDojaangs`.

    /**
     * Updates an existing dojaang's data.
     * After successful update, it invalidates the specific dojaang's cache entry and triggers a refetch of all dojaangs
     * to update the local state and ensure data consistency.
     * This function is memoized using `useCallback`.
     * @param id The ID of the dojaang to update.
     * @param data The partial dojaang data to apply updates (excluding id).
     */
    const updateDojaang = useCallback(async (id: number, data: Omit<Dojaang, "id">) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token not found.");

            // Invalidate the specific cache entry for the updated dojaang.
            dojaangByIdCache.current.delete(id);

            await apiRequest(`/Dojaang/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...data, id }), // Ensure ID is part of the body if required by API
            });
            await fetchDojaangs(); // Re-fetch all dojaangs to update state and caches.
        } catch (e) {
            setError(e instanceof Error ? `Failed to update dojaang: ${e.message}` : "Failed to update dojaang");
            console.error("Error updating dojaang:", e);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken, fetchDojaangs]); // Dependencies: `apiRequest`, `getToken`, and `fetchDojaangs`.

    /**
     * Deletes a dojaang from the database.
     * After successful deletion, it invalidates the specific dojaang's cache entry and triggers a refetch of all dojaangs
     * to update the local state and ensure data consistency.
     * This function is memoized using `useCallback`.
     * @param id The ID of the dojaang to delete.
     */
    const deleteDojaang = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token not found.");

            // Invalidate the specific cache entry for the deleted dojaang.
            dojaangByIdCache.current.delete(id);

            await apiRequest(`/Dojaang/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchDojaangs(); // Re-fetch all dojaangs to update state and caches.
        } catch (e) {
            setError(e instanceof Error ? `Failed to delete dojaang: ${e.message}` : "Failed to delete dojaang");
            console.error("Error deleting dojaang:", e);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken, fetchDojaangs]); // Dependencies: `apiRequest`, `getToken`, and `fetchDojaangs`.

    /**
     * Fetches a single dojaang by its ID.
     * Checks the `dojaangByIdCache` first; if found, it returns the cached data immediately.
     * Otherwise, it makes an API request to fetch the dojaang and then caches the result.
     * This function is memoized using `useCallback` for performance optimization.
     * @param id The unique identifier of the dojaang to fetch.
     * @returns A Promise that resolves to the `Dojaang` object if found, or `null` if not found or an error occurs.
     */
    const getDojaang = useCallback(async (id: number): Promise<Dojaang | null> => {
        // Check if the dojaang is already in the cache.
        if (dojaangByIdCache.current.has(id)) {
            console.log(`[DojaangContext] Returning dojaang ${id} from cache.`);
            return dojaangByIdCache.current.get(id) || null;
        }

        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) throw new Error("Authentication token not found.");

            console.log(`[DojaangContext] Fetching dojaang ${id} from API.`);
            const data = await apiRequest<Dojaang>(`/Dojaang/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // If the API call is successful, store the fetched dojaang in the cache.
            if (data && data.id != null) { // Ensure data and its id exist
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
    }, [apiRequest, getToken]); // Dependencies: `apiRequest` and `getToken` for function stability.

    // --- Effects ---

    /**
     * `useEffect` to fetch all dojaangs when the component mounts.
     * It checks for an existing authentication token before attempting to fetch.
     */
    useEffect(() => {
        const token = getToken();
        if (token) {
            fetchDojaangs();
        } else {
            setLoading(false); // If no token, stop loading and set initial error.
            setError("Authentication required to load dojaangs.");
        }
    }, [getToken, fetchDojaangs]); // Dependencies: `getToken` and `fetchDojaangs`.

    // --- Render ---

    /**
     * Renders the `DojaangContext.Provider`, making the `dojaangs` data, `loading` state, `error` messages,
     * and dojaang-related functions available to all child components wrapped by this provider.
     */
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

/**
 * Custom hook to consume the DojaangContext.
 * Throws an error if used outside of a `DojaangProvider`, ensuring correct usage.
 * @returns The DojaangContextType value.
 * @throws Error if `useDojaangs` is not used within a `DojaangProvider`.
 */
export const useDojaangs = () => {
    const ctx = useContext(DojaangContext);
    if (!ctx) throw new Error("useDojaangs must be used within a DojaangProvider");
    return ctx;
};