'use client';

// 1. External imports
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { Tul } from '../types/Tul';
import { useApiRequest } from '../utils/api';

// Interface defining the shape of the TulContext data and functions.
interface TulContextType {
    tuls: Tul[];
    loading: boolean;
    error: string | null;
    fetchTuls: () => Promise<void>;
    getTulById: (id: number) => Promise<Tul | null>;
    getTulsByRank: (rankId: number) => Promise<Tul[]>;
}

// Initializing the TulContext with default values.
const TulContext = createContext<TulContextType>({
    tuls: [],
    loading: false,
    error: null,
    fetchTuls: async () => {},
    getTulById: async () => null,
    getTulsByRank: async () => [],
});

// 1. Context Hooks
// Custom hook to consume the TulContext, providing access to tul data and functions.
export const useTuls = () => useContext(TulContext);

// The provider component that manages tul data, loading states, errors, and memoized fetching logic.
export const TulProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    // 2. State Hooks
    // State to hold the list of all tuls.
    const [tuls, setTuls] = useState<Tul[]>([]);
    // State to indicate if an API request is currently in progress.
    const [loading, setLoading] = useState<boolean>(true);
    // State to store any error messages from API requests.
    const [error, setError] = useState<string | null>(null);

    // Cache for individual tuls fetched by ID.
    const tulByIdCache = useRef<Map<number, Tul>>(new Map());
    // Cache for lists of tuls fetched by Rank ID.
    const tulsByRankCache = useRef<Map<number, Tul[]>>(new Map());

    // Custom hook for making API requests.
    const { apiRequest } = useApiRequest();

    // 3. Effects
    // No specific useEffects needed for memoization beyond the useCallback dependencies.

    // 4. Functions (memoized with useCallback)

    /**
     * Fetches all tuls from the API.
     * Updates the 'tuls' state and populates both tulByIdCache and tulsByRankCache
     * for 'all tuls' entry (if applicable, though generally getTulsByRank is specific).
     * Memoized with useCallback.
     */
    const fetchTuls = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<Tul[]>('/Tuls');
            const fetchedTuls = Array.isArray(res) ? res : [];
            setTuls(fetchedTuls);

            // Populate tulByIdCache with all fetched tuls
            fetchedTuls.forEach(tul => tulByIdCache.current.set(tul.id, tul));

            // Optionally, if '/Tuls' also represents all tuls for a 'rank 0' or similar, you could cache it:
            // tulsByRankCache.current.set(0, fetchedTuls); // Example: if 0 means all ranks

        } catch (err) {
            setError('Failed to load tuls');
            setTuls([]);
            toast.error(
                'Failed to load tuls' +
                (err instanceof Error ? `: ${err.message}` : '')
            );
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Depends on apiRequest to ensure stability.

    /**
     * Fetches a single tul by its ID.
     * Checks the tulByIdCache first; if found, returns cached data.
     * Otherwise, makes an API request and caches the result.
     * Memoized with useCallback.
     * @param id The ID of the tul to fetch.
     * @returns The Tul object or null if not found/error.
     */
    const getTulById = useCallback(
        async (id: number): Promise<Tul | null> => {
            // Check cache first
            if (tulByIdCache.current.has(id)) {
                return tulByIdCache.current.get(id) || null;
            }

            setLoading(true);
            setError(null);
            try {
                const res = await apiRequest<Tul>(`/Tuls/${id}`);
                if (res) {
                    tulByIdCache.current.set(id, res); // Store in cache
                }
                return res;
            } catch (err) {
                setError('Failed to load tul');
                toast.error(
                    'Failed to load tul' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiRequest] // Depends on apiRequest to ensure stability.
    );

    /**
     * Fetches tuls associated with a specific rank ID.
     * Checks the tulsByRankCache first; if found, returns cached data.
     * Otherwise, makes an API request and caches the result.
     * Memoized with useCallback.
     * @param rankId The ID of the rank to filter tuls by.
     * @returns An array of Tul objects or an empty array if not found/error.
     */
    const getTulsByRank = useCallback(
        async (rankId: number): Promise<Tul[]> => {
            // Check cache first
            if (tulsByRankCache.current.has(rankId)) {
                return tulsByRankCache.current.get(rankId) || [];
            }

            setLoading(true);
            setError(null);
            try {
                const res = await apiRequest<Tul[]>(`/Tuls/by-rank/${rankId}`);
                const fetchedTulsByRank = Array.isArray(res) ? res : [];
                tulsByRankCache.current.set(rankId, fetchedTulsByRank); // Store in cache
                return fetchedTulsByRank;
            } catch (err) {
                setError('Failed to load tuls by rank');
                toast.error(
                    'Failed to load tuls by rank' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
                return [];
            } finally {
                setLoading(false);
            }
        },
        [apiRequest] // Depends on apiRequest to ensure stability.
    );

    // 5. Render
    // Provides the context values to all child components via the Provider.
    return (
        <TulContext.Provider
            value={{
                tuls,
                loading,
                error,
                fetchTuls,
                getTulById,
                getTulsByRank,
            }}
        >
            {children}
        </TulContext.Provider>
    );
};