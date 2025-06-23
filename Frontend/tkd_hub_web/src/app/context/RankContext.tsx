'use client';

// 1. External imports
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useRef, // Import useRef for creating mutable references for caches
} from 'react';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { Rank } from '@/app/types/Rank'; // Assuming Rank type is defined here
import { useApiRequest } from '../utils/api'; // Custom hook for API requests

// --- Type Definitions ---

/**
 * Defines the shape of the RankContext, outlining available data and functions.
 */
type RankContextType = {
    ranks: Rank[];
    loading: boolean;
    error: string | null;
    fetchRanks: () => Promise<void>;
    getRankById: (id: number) => Promise<Rank | null>;
};

// --- Context Creation ---

/**
 * Initializes the RankContext with default empty values.
 * These defaults are used when a component consumes the context without a provider,
 * or as initial values before actual data is loaded.
 */
const RankContext = createContext<RankContextType>({
    ranks: [],
    loading: false,
    error: null,
    fetchRanks: async () => {},
    getRankById: async () => null,
});

// --- Context Hooks ---

/**
 * Custom hook to consume the RankContext.
 * This hook allows any descendant component of `RankProvider` to easily access
 * the `ranks` data, `loading` state, `error` messages, and various rank-related functions.
 * @returns The current value of the RankContext (RankContextType).
 */
export const useRanks = () => useContext(RankContext);

// --- Rank Provider Component ---

/**
 * The `RankProvider` component is responsible for managing the state of ranks
 * (fetching, loading, errors) and providing rank-related functionalities to its children.
 * It uses memoization techniques to optimize performance by caching API responses.
 * @param children React nodes to be rendered within the provider's scope.
 */
export const RankProvider = ({ children }: { children: ReactNode }) => {
    // 1. Context hooks
    // Custom hook for making API requests.
    const { apiRequest } = useApiRequest();

    // 2. State Hooks
    // State to hold the list of all ranks.
    const [ranks, setRanks] = useState<Rank[]>([]);
    // State to indicate if an API request is currently in progress.
    const [loading, setLoading] = useState(false);
    // State to store any error messages from API requests.
    const [error, setError] = useState<string | null>(null);

    // Caches for memoizing API responses to avoid redundant calls.
    // `rankByIdCache`: Stores individual rank objects fetched by their ID.
    // Using `useRef` ensures the cache persists across renders without causing re-renders.
    const rankByIdCache = useRef<Map<number, Rank>>(new Map());

    // 3. Effects
    // (No specific useEffects are typically needed here for memoization itself,
    // as memoization is handled within the useCallback functions and useRef caches.)

    // 4. Functions (memoized with useCallback)

    /**
     * Fetches all ranks from the API.
     * Updates the 'ranks' state and populates the `rankByIdCache` with fetched ranks
     * to optimize subsequent `getRankById` calls.
     * This function is memoized using `useCallback` to prevent unnecessary re-creations.
     */
    const fetchRanks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<{ data: Rank[] }>('/Ranks');
            // Ensure `res.data` is an array; default to empty array if not.
            const ranksArray = Array.isArray(res.data) ? res.data : [];
            setRanks(ranksArray);

            // Populate rankByIdCache for quick lookup of individual ranks.
            ranksArray.forEach(rank => {
                if (rank.id != null) { // Ensure id is not null or undefined
                    rankByIdCache.current.set(rank.id, rank);
                }
            });
        } catch (err) {
            // Handle and display error message using react-hot-toast.
            setError('Failed to load ranks');
            setRanks([]);
            toast.error(
                'Failed to load ranks' +
                (err instanceof Error ? `: ${err.message}` : '')
            );
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Dependency: `apiRequest` to ensure the function is stable.

    /**
     * Fetches a single rank by its ID.
     * Checks the `rankByIdCache` first; if found, it returns the cached data immediately.
     * Otherwise, it makes an API request to fetch the rank and then caches the result.
     * This function is memoized using `useCallback` for performance optimization.
     * @param id The unique identifier of the rank to fetch.
     * @returns A Promise that resolves to the `Rank` object if found, or `null` if not found or an error occurs.
     */
    const getRankById = useCallback(
        async (id: number): Promise<Rank | null> => {
            // Check if the rank is already in the cache.
            if (rankByIdCache.current.has(id)) {
                console.log(`[RankContext] Returning rank ${id} from cache.`);
                return rankByIdCache.current.get(id) || null;
            }

            setLoading(true);
            setError(null);
            console.log(`[RankContext] Fetching rank ${id} from API.`);
            try {
                const res = await apiRequest<Rank>(`/Ranks/${id}`);
                // If the API call is successful, store the fetched rank in the cache.
                if (res) {
                    rankByIdCache.current.set(id, res);
                }
                return res;
            } catch (err) {
                // Handle and display error message.
                setError('Failed to load rank');
                toast.error(
                    'Failed to load rank' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiRequest] // Dependency: `apiRequest` to ensure the function is stable.
    );

    // 5. Render
    /**
     * Renders the `RankContext.Provider`, making the `ranks` data, `loading` state, `error` messages,
     * and rank-related functions (`fetchRanks`, `getRankById`) available to all child components
     * wrapped by this provider.
     */
    return (
        <RankContext.Provider
            value={{ ranks, loading, error, fetchRanks, getRankById }}
        >
            {children}
        </RankContext.Provider>
    );
};